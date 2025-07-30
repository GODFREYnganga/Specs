import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { connectToDatabase } from "@/lib/mongodb"
import EyewearProduct from "@/models/EyewearProduct"
import { handleApiError } from "../errorHandler"

// Helper function to process image path
function processImagePath(imagePath: string | undefined): string {
  if (!imagePath) return '';
  
  // If it's already a full URL or path starting with /, don't modify
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Otherwise, prepend the eyewear-products path
  return `/images/eyewear-products/${imagePath}`;
}

// Helper function to process all image fields in data object
function processImageFields(data: Record<string, any>): Record<string, any> {
  const processedData = { ...data };
  
  // Process IMAGE 1-6 fields
  for (let i = 1; i <= 6; i++) {
    const imageKey = `IMAGE ${i}`;
    if (processedData[imageKey]) {
      processedData[imageKey] = processImagePath(processedData[imageKey]);
    }
  }
  
  return processedData;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      return NextResponse.json({ error: "Please upload a valid Excel file (.xlsx or .xls)" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: 'buffer' })

    // Accept any sheet, default to first
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    
    if (!sheet) {
      return NextResponse.json({ error: 'No valid sheet found in Excel file.' }, { status: 400 })
    }
    
    // Convert to JSON (header row auto-detected)
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown as (string | number)[][];

    console.log(`Found ${rows.length} rows in sheet`)
    
    // Skip first row if it's empty or contains notes (same logic as preview)
    let headerRowIndex = 0
    if (rows.length > 1 && 
        (!rows[0] || 
         rows[0].length === 0 || 
         (rows[0].length === 1 && typeof rows[0][0] === 'string' && rows[0][0].toLowerCase().includes('note')))) {
      headerRowIndex = 1
      console.log('Skipping first row, using second row as header')
    }

    // Headers are in headerRowIndex, data starts from the next row
    const headers = rows[headerRowIndex] as string[];
    const dataRows = rows.slice(headerRowIndex + 1) as (string | number)[][];
    
    console.log(`Found ${headers.length} headers, sample: ${JSON.stringify(headers.slice(0, 5))}...`)
    console.log(`Data rows: ${dataRows.length}`)

    let currentParent: Record<string, any> | null = null;
    let productsToInsert: any[] = [];
    let errorCount = 0;
    let productsProcessed = 0;
    let errors: any[] = [];

    // Track children for each parent
    let currentChildren: Record<string, any>[] = [];

    function processParentChildGroup(parent: Record<string, any> | null, children: Record<string, any>[]) {
      if (!parent || children.length === 0) return;
      for (const rowData of children) {
        // Merge parent and child, but child only overrides if value is not empty
        const productData: Record<string, any> = {};
        for (const key of headers) {
          const childVal = rowData[key];
          const parentVal = parent[key];
          productData[key] = (childVal !== undefined && childVal !== null && childVal !== '') ? childVal : parentVal;
        }
        
        // Explicit field mapping (legacy fields for compatibility)
        
        // Helper function to safely get a non-empty string value
        const safeStringValue = (value: any): string => {
          if (!value) return '';
          return String(value).trim();
        };
        
        // Generate name with proper fallbacks
        const titleVal = safeStringValue(productData['TITLE']);
        const brandVal = safeStringValue(productData['BRAND NAME']);
        const skuVal = safeStringValue(productData['SKU']);
        
        const productName = titleVal || brandVal || skuVal || `Product-${Date.now()}`;
        
        console.log(`Child product name logic: TITLE='${titleVal}' BRAND='${brandVal}' SKU='${skuVal}' => NAME='${productName}'`);
        
        const product = {
          // Required fields by EyewearProduct schema
          name: productName,
          price: Number(productData['SALE PRICE']) || Number(productData['sale price']) || 0,
          // Legacy fields for compatibility
          brand_name: productData['BRAND NAME'],
          product_title: productData['TITLE'] || '',
          product_description: productData['Description'] || '',
          print_name: productData['PRINT NAME'],
          product_type: productData['Product type'],
          sku: productData['SKU'],
          barcode: productData['Barcode'],
          color_code: productData['COLOR CODE'],
          color: productData['COLOR'],
          category: (productData['Category'] || '').toLowerCase(),
          weight: productData['WEIGHT'],
          size: productData['SIZE'],
          material: productData['MATERIAL'],
          shape: productData['SHAPE'],
          frame_dimension: productData['FRAME DIMENSION'],
          frame_type: productData['FRAME TYPE'],
          gender: productData['GENDER'],
          weight_group: productData['WEIGHT GROUP'],
          age_group: productData['Age group'],
          frame_width: productData['FRAME WIDTH'],
          lenses_supported: productData['LENSES Supported'],
          collection_type: productData['COLLECTION type'],
          unit: productData['UNIT'],
          tags: productData['TAG'] ? String(productData['TAG']).split(',') : [],
          tax: productData['TAX'],
          start_qty: Number(productData['Start QTY']) || 0,
          sale_price: Number(productData['SALE PRICE']) || 0,
          mrp: Number(productData['MRP/OLD PRICE']) || 0,
          
          // Process image paths - prepend the path if just a filename is provided
          images: [
            productData['IMAGE 1'], productData['IMAGE 2'], productData['IMAGE 3'],
            productData['IMAGE 4'], productData['IMAGE 5'], productData['IMAGE 6']
          ]
            .filter(Boolean)
            .map((img: string) => processImagePath(img)),
          // Set the main image for backwards compatibility
          image: processImagePath(productData['IMAGE 1']),
          short_technical_information: productData['SHORT Technical Information'],
          long_technical_information: productData['LONG Technical Information'],
          publish: productData['Publish'],
          show_on_website: productData['Show on Website'],
          where_to_show: productData['Where to Show'],
          incentive_for_salesman: productData['Incentive for salesman'],
          loyalty_pts: productData['Loyalty pts'],
          related_products: productData['Related Products'] ? String(productData['Related Products']).split(',') : [],
          keywords: productData['Keywords'],
          meta_description: productData['Meta Description'] || '',          meta_title: productData['Meta Title'] || '',
          
          created_at: new Date(),
          updated_at: new Date(),
          
          // Store all Excel columns (including custom fields) with processed image paths          data: processImageFields(productData)
        };
        
        // Validate required fields for child (merged)
        if (!product.name || product.name.trim() === '') {
          errorCount++;
          errors.push({ error: `Missing name in merged child row: SKU=${product.sku}, TITLE='${productData['TITLE']}', BRAND='${productData['BRAND NAME']}'` });
          continue;
        }
        if (!product.price || product.price <= 0) {
          errorCount++;
          errors.push({ error: `Missing or invalid price in merged child row: SKU=${product.sku}` });
          continue;
        }
        productsToInsert.push(product);
      }
    }

    for (const row of dataRows) {
      const rowData: Record<string, any> = {};
      headers.forEach((header: string, idx: number) => {
        rowData[header] = row[idx] || '';
      });
      // Trim whitespace from Product Variables
      if (rowData['Product Variables']) {
        rowData['Product Variables'] = rowData['Product Variables'].toString().trim();
      }
      if (rowData['Product Variables'] === 'Parent') {
        processParentChildGroup(currentParent, currentChildren);
        currentParent = rowData;
        currentChildren = [];
      } else if (rowData['Product Variables'] === 'Child' && currentParent) {
        currentChildren.push(rowData);
      } else if (
        rowData['Product Variables'] === 'Simple' ||
        !rowData['Product Variables']
      ) {
        
        // Process as a standalone product (no parent/child logic)
        console.log(`Processing simple/standalone product: SKU=${rowData['SKU']}, TITLE=${rowData['TITLE']}, SALE PRICE=${rowData['SALE PRICE']}`)
        
        // Helper function to safely get a non-empty string value
        const safeStringValue = (value: any): string => {
          if (!value) return '';
          return String(value).trim();
        };
        
        // Generate name with proper fallbacks
        const titleVal = safeStringValue(rowData['TITLE']);
        const brandVal = safeStringValue(rowData['BRAND NAME']);
        const skuVal = safeStringValue(rowData['SKU']);
        
        const productName = titleVal || brandVal || skuVal || `Product-${Date.now()}`;
        
        console.log(`Simple product name logic: TITLE='${titleVal}' BRAND='${brandVal}' SKU='${skuVal}' => NAME='${productName}'`);
        
        const product = {
          name: productName,
          price: Number(rowData['SALE PRICE']) || Number(rowData['sale price']) || 0,
          brand_name: rowData['BRAND NAME'],
          product_title: rowData['TITLE'] || '',
          product_description: rowData['Description'] || '',
          print_name: rowData['PRINT NAME'],
          product_type: rowData['Product type'],
          sku: rowData['SKU'],
          barcode: rowData['Barcode'],
          color_code: rowData['COLOR CODE'],
          color: rowData['COLOR'],
          category: (rowData['Category'] || '').toLowerCase(),
          weight: rowData['WEIGHT'],
          size: rowData['SIZE'],
          material: rowData['MATERIAL'],
          shape: rowData['SHAPE'],
          frame_dimension: rowData['FRAME DIMENSION'],
          frame_type: rowData['FRAME TYPE'],
          gender: rowData['GENDER'],
          weight_group: rowData['WEIGHT GROUP'],
          age_group: rowData['Age group'],
          frame_width: rowData['FRAME WIDTH'],
          lenses_supported: rowData['LENSES Supported'],
          collection_type: rowData['COLLECTION type'],
          unit: rowData['UNIT'],
          tags: rowData['TAG'] ? String(rowData['TAG']).split(',') : [],
          tax: rowData['TAX'],
          start_qty: Number(rowData['Start QTY']) || 0,
          sale_price: Number(rowData['SALE PRICE']) || 0,
          
          mrp: Number(rowData['MRP/OLD PRICE']) || 0,
          // Process image paths - prepend the path if just a filename is provided
          images: [
            rowData['IMAGE 1'], rowData['IMAGE 2'], rowData['IMAGE 3'],
            rowData['IMAGE 4'], rowData['IMAGE 5'], rowData['IMAGE 6']
          ]
            .filter(Boolean)
            .map((img: string) => processImagePath(img)),
          // Set the main image for backwards compatibility
          image: processImagePath(rowData['IMAGE 1']),
          short_technical_information: rowData['SHORT Technical Information'],
          long_technical_information: rowData['LONG Technical Information'],
          publish: rowData['Publish'],
          show_on_website: rowData['Show on Website'],
          where_to_show: rowData['Where to Show'],
          incentive_for_salesman: rowData['Incentive for salesman'],
          loyalty_pts: rowData['Loyalty pts'],
          related_products: rowData['Related Products'] ? String(rowData['Related Products']).split(',') : [],
          
          keywords: rowData['Keywords'],
          meta_description: rowData['Meta Description'] || '',
          meta_title: rowData['Meta Title'] || '',
          created_at: new Date(),
          updated_at: new Date(),
          // Store all Excel columns (including custom fields) with processed image paths
          data: processImageFields(rowData)
        };
        // Validate required fields for simple product
        if (!product.name) {
          errorCount++;
          errors.push({ error: 'Missing name in simple row' });
          continue;
        }
        if (!product.price || product.price <= 0) {
          errorCount++;
          errors.push({ error: 'Missing or invalid price in simple row' });
          continue;
        }
        productsToInsert.push(product);
      }
    }
    // Process last group
    processParentChildGroup(currentParent, currentChildren);

    // Insert/update products
    for (let i = 0; i < productsToInsert.length; i++) {
      const product = productsToInsert[i]
      try {
        const sku = product.sku || ''
        if (sku) {
          const existing = await EyewearProduct.findOne({ sku })
          if (existing) {
            await EyewearProduct.updateOne({ sku }, { $set: product })
          } else {
            await EyewearProduct.create(product)
          }
        } else {
          await EyewearProduct.create(product)
        }
        productsProcessed++
      } catch (error: any) {
        errorCount++
        errors.push({ error: error.message })
      }
    }

    const total = productsProcessed + errorCount
    const successRate = total > 0 ? Math.round((productsProcessed / total) * 100) : 0

    return NextResponse.json({
      success: true,
      productsProcessed,
      errors: errorCount,
      total,
      successRate,
      errorDetails: errors.slice(0, 50),      message: `Processed ${productsProcessed} products. ${errorCount > 0 ? errorCount + ' errors.' : ''}`
    })
  } catch (error: any) {
    console.error("Bulk upload process error:", error);
    
    // Check if this is a validation error from MongoDB/Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = [];
      
      // Extract specific field errors
      for (const field in error.errors) {
        validationErrors.push({
          field: field,
          message: error.errors[field].message,
          value: error.errors[field].value
        });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: "Product validation failed. Please check your data.", 
        validationErrors: validationErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to process bulk upload",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
