import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { handleApiError } from "../errorHandler"

interface ProductPreview {
  brandName: string
  title: string
  description: string
  printName: string
  productType: string
  variationType: string
  variationRole: string
  sku: string
  barcode: string
  colorCode: string
  colorName: string
  size: string
  material: string
  shape: string
  gender: string
  frameType: string
  weight: string
  frameWidth: string
  eyeglassesCollection: string
  sunglassesCollection: string
  technicalInfo: string
  isPublished: boolean
  showOnWebsite: boolean
  whereToShow: string[]
  loyaltyPoints: number
  metaKeywords: string
  metaDescription: string
  metaTitle: string
  price: number
  stock: number
}

export async function POST(request: NextRequest) {
  try {
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

    // Process Products Sheet
    let products: any[] = []
    const productSheetName = workbook.SheetNames.includes('Products') ? 'Products' : 
                            workbook.SheetNames.includes('FR SG') ? 'FR SG' : null

    if (productSheetName) {
      const productSheet = workbook.Sheets[productSheetName]
      const rows = XLSX.utils.sheet_to_json(productSheet, { header: 1 }) as any[]
        // Skip first row if it's empty or contains notes
      let headerRowIndex = 0
      if (rows.length > 1 && 
          (!rows[0] || 
           rows[0].length === 0 || 
           (rows[0].length === 1 && typeof rows[0][0] === 'string' && rows[0][0].toLowerCase().includes('note')))) {
        headerRowIndex = 1
      }
      
      const headers = rows[headerRowIndex]
      const dataRows = rows.slice(headerRowIndex + 1)

      let currentParent: any = null
      let currentChildren: any[] = []
      
      // Helper function to process a parent/child group
      const processGroup = (parent: any, children: any[]) => {
        // Add parent to preview
        if (parent) {
          const parentProduct: Record<string, any> = { type: 'parent' };
          headers.forEach((header: string) => {            if (/image \d+/i.test(header)) {
              if (!parentProduct.images) parentProduct.images = [];
              if (parent[header]) {                // Format image paths
                const img = parent[header].toString();
                const formattedImg = img.startsWith('http') || img.startsWith('/') ? img : `/images/eyewear-products/${img}`;
                parentProduct.images.push(formattedImg);
                
                // Set main image if this is IMAGE 1
                if (header.toLowerCase() === 'image 1') {
                  parentProduct.image = formattedImg;
                }
              }
            } else if (header === 'TAG' || header === 'Related Products') {
              parentProduct[header] = parent[header] ? parent[header].toString().split(',').map((s: string) => s.trim()).filter(Boolean) : [];
            } else if (header === 'Where to show') {
              parentProduct[header] = parent[header] ? parent[header].toString().split(',').map((s: string) => s.trim()).filter(Boolean) : [];
            } else if (header === 'Start QTY' || header === 'sale price' || header === 'MRP/OLD Price' || header === 'Loyalty pts') {
              parentProduct[header] = parent[header] ? parseFloat(parent[header]) : 0;
            } else if (header === 'Publish' || header === 'Show on Website') {
              parentProduct[header] = ['yes','true','y','1'].includes((parent[header]||'').toString().toLowerCase());
            } else {
              parentProduct[header] = parent[header] || '';
            }
          });
          products.push(parentProduct);
        }
        
        // Process each child, merging with parent
        for (const child of children) {
          const productData = parent ? { ...parent, ...child } : child;
          const childProduct: Record<string, any> = { type: 'child' };
          headers.forEach((header: string) => {            if (/image \d+/i.test(header)) {
              if (!childProduct.images) childProduct.images = [];
              if (productData[header]) {                // Format image paths
                const img = productData[header].toString();
                const formattedImg = img.startsWith('http') || img.startsWith('/') ? img : `/images/eyewear-products/${img}`;
                childProduct.images.push(formattedImg);
                
                // Set main image if this is IMAGE 1
                if (header.toLowerCase() === 'image 1') {
                  childProduct.image = formattedImg;
                }
              }
            } else if (header === 'TAG' || header === 'Related Products') {
              childProduct[header] = productData[header] ? productData[header].toString().split(',').map((s: string) => s.trim()).filter(Boolean) : [];
            } else if (header === 'Where to show') {
              childProduct[header] = productData[header] ? productData[header].toString().split(',').map((s: string) => s.trim()).filter(Boolean) : [];
            } else if (header === 'Start QTY' || header === 'sale price' || header === 'MRP/OLD Price' || header === 'Loyalty pts') {
              childProduct[header] = productData[header] ? parseFloat(productData[header]) : 0;
            } else if (header === 'Publish' || header === 'Show on Website') {
              childProduct[header] = ['yes','true','y','1'].includes((productData[header]||'').toString().toLowerCase());
            } else {
              childProduct[header] = productData[header] || '';
            }
          });
          products.push(childProduct);
        }
      }
      
      // Process each row to build parent/child groups
      for (const row of dataRows) {
        if (!row || row.length === 0) continue  // Skip empty rows
        const rowData: Record<string, any> = {}
        headers.forEach((header: string, index: number) => {
          if (header) {
            rowData[header] = row[index] !== undefined ? row[index] : ''
          }
        })
        // Trim whitespace from Product Variables field
        if (rowData['Product Variables']) {
          rowData['Product Variables'] = rowData['Product Variables'].toString().trim();
        }
        const variationRole = rowData['Product Variables'] || rowData['Variation Role'] || '';
        
        if (variationRole.toString().toLowerCase() === 'parent') {
          // Process previous group before starting new one
          if (currentParent || currentChildren.length > 0) {
            processGroup(currentParent, currentChildren);
          }
          // Start new group
          currentParent = { ...rowData };
          currentChildren = [];
        } else if (variationRole.toString().toLowerCase() === 'child') {
          currentChildren.push({ ...rowData });
        } else {
          // Simple product - process previous group first, then add simple product
          if (currentParent || currentChildren.length > 0) {
            processGroup(currentParent, currentChildren);
            currentParent = null;
            currentChildren = [];
          }
          // Add simple product
          const simpleProduct: Record<string, any> = { type: 'simple' };
          headers.forEach((header: string) => {
            if (/image \d+/i.test(header)) {
              if (!simpleProduct.images) simpleProduct.images = [];
              if (rowData[header]) simpleProduct.images.push(rowData[header]);
            } else if (header === 'TAG' || header === 'Related Products') {
              simpleProduct[header] = rowData[header] ? rowData[header].toString().split(',').map((s: string) => s.trim()).filter(Boolean) : [];
            } else if (header === 'Where to show') {
              simpleProduct[header] = rowData[header] ? rowData[header].toString().split(',').map((s: string) => s.trim()).filter(Boolean) : [];
            } else if (header === 'Start QTY' || header === 'sale price' || header === 'MRP/OLD Price' || header === 'Loyalty pts') {
              simpleProduct[header] = rowData[header] ? parseFloat(rowData[header]) : 0;
            } else if (header === 'Publish' || header === 'Show on Website') {
              simpleProduct[header] = ['yes','true','y','1'].includes((rowData[header]||'').toString().toLowerCase());
            } else {
              simpleProduct[header] = rowData[header] || '';
            }
          });
          products.push(simpleProduct);
        }
      }
      
      // Process the last group
      if (currentParent || currentChildren.length > 0) {
        processGroup(currentParent, currentChildren);
      }
    }

    return NextResponse.json({ 
      products,
      filters: [] // Removed filter preview functionality as per requirements
    })
  } catch (error) {
    console.error("Excel preview error:", error)
    return handleApiError(error)
  }
}