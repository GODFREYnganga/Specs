import { NextResponse } from "next/server"
import * as XLSX from "xlsx"
import path from "path"
import { createReadStream } from "fs"
import fs from "fs/promises"

export async function GET() {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()
    
    // Create the Products sheet with headers
    const productHeaders = [
      "Product Variables", // Parent/Child
      "BRAND NAME",
      "TITLE",
      "Description", 
      "PRINT NAME",
      "Product type", // Eyeglasses/Sunglasses
      "SKU",
      "Barcode",
      "COLOR CODE",
      "COLOR",
      "Category",
      "WEIGHT",
      "SIZE",
      "MATERIAL",
      "SHAPE",
      "FRAME DIMENSION",
      "FRAME TYPE",
      "GENDER",
      "WEIGHT GROUP",
      "Age group",
      "FRAME WIDTH",
      "LENSES Supported",
      "COLLECTION type",
      "UNIT",
      "TAG",
      "TAX",
      "Start QTY",
      "SALE PRICE",
      "MRP/OLD PRICE",
      "IMAGE 1",
      "IMAGE 2",
      "IMAGE 3",
      "IMAGE 4", 
      "IMAGE 5",
      "IMAGE 6",
      "SHORT Technical Information",
      "LONG Technical Information",
      "Publish", // YES/NO
      "Show on Website", // YES/NO
      "Where to Show",
      "Incentive for salesman",
      "Loyalty pts",
      "Related Products",
      "Keywords",
      "Meta Description",
      "Meta Title"
    ]
    
    // Sample data for Products sheet
    const productSampleData = [
      // Parent product
      {
        "Product Variables": "Parent",
        "BRAND NAME": "RayBan",
        "TITLE": "Classic Wayfarers",
        "Description": "Iconic RayBan Wayfarer sunglasses",
        "PRINT NAME": "RayBan Wayfarers",
        "Product type": "Sunglasses",
        "SKU": "RB-WF-2140",
        "Barcode": "8053672258554",
        "COLOR CODE": "",
        "COLOR": "",
        "Category": "Sunglasses",
        "WEIGHT": "",
        "SIZE": "",
        "MATERIAL": "Acetate",
        "SHAPE": "Wayfarer",
        "FRAME DIMENSION": "50-22-150",
        "FRAME TYPE": "Full-rim",
        "GENDER": "Unisex",
        "WEIGHT GROUP": "Light",
        "Age group": "Adult",
        "FRAME WIDTH": "Medium",
        "LENSES Supported": "Polarized",
        "COLLECTION type": "Classic",
        "UNIT": "Piece",
        "TAG": "iconic,classic,bestseller",
        "TAX": "16",
        "Start QTY": "",
        "SALE PRICE": "",
        "MRP/OLD PRICE": "",
        "IMAGE 1": "",
        "IMAGE 2": "",
        "IMAGE 3": "",
        "IMAGE 4": "",
        "IMAGE 5": "",
        "IMAGE 6": "",
        "SHORT Technical Information": "UV protection, Polarized lenses",
        "LONG Technical Information": "100% UV protection, Polarized lenses reduce glare, Includes case and cloth",
        "Publish": "YES",
        "Show on Website": "YES",
        "Where to Show": "homepage,bestsellers",
        "Incentive for salesman": "5",
        "Loyalty pts": "10",
        "Related Products": "RB-AV-3025,RB-CL-2132",
        "Keywords": "rayban,wayfarer,sunglasses,classic",
        "Meta Description": "Shop the iconic RayBan Wayfarer sunglasses with 100% UV protection and timeless style.",
        "Meta Title": "RayBan Wayfarer Classic Sunglasses | UV Protection"
      },
      // Child product 1
      {
        "Product Variables": "Child",
        "BRAND NAME": "",
        "TITLE": "",
        "Description": "",
        "PRINT NAME": "",
        "Product type": "",
        "SKU": "RB-WF-2140-901",
        "Barcode": "8053672258561",
        "COLOR CODE": "901",
        "COLOR": "Black",
        "Category": "",
        "WEIGHT": "28g",
        "SIZE": "Standard",
        "MATERIAL": "",
        "SHAPE": "",
        "FRAME DIMENSION": "",
        "FRAME TYPE": "",
        "GENDER": "",
        "WEIGHT GROUP": "",
        "Age group": "",
        "FRAME WIDTH": "",
        "LENSES Supported": "",
        "COLLECTION type": "",
        "UNIT": "",
        "TAG": "",
        "TAX": "",
        "Start QTY": "15",
        "SALE PRICE": "12500",
        "MRP/OLD PRICE": "15000",
        "IMAGE 1": "https://example.com/images/rayban-wayfarer-black-1.jpg",
        "IMAGE 2": "https://example.com/images/rayban-wayfarer-black-2.jpg",
        "IMAGE 3": "",
        "IMAGE 4": "",
        "IMAGE 5": "",
        "IMAGE 6": "",
        "SHORT Technical Information": "",
        "LONG Technical Information": "",
        "Publish": "",
        "Show on Website": "",
        "Where to Show": "",
        "Incentive for salesman": "",
        "Loyalty pts": "",
        "Related Products": "",
        "Keywords": "",
        "Meta Description": "",
        "Meta Title": ""
      },
      // Child product 2
      {
        "Product Variables": "Child",
        "BRAND NAME": "",
        "TITLE": "",
        "Description": "",
        "PRINT NAME": "",
        "Product type": "",
        "SKU": "RB-WF-2140-902",
        "Barcode": "8053672258578",
        "COLOR CODE": "902",
        "COLOR": "Tortoise",
        "Category": "",
        "WEIGHT": "28g",
        "SIZE": "Standard",
        "MATERIAL": "",
        "SHAPE": "",
        "FRAME DIMENSION": "",
        "FRAME TYPE": "",
        "GENDER": "",
        "WEIGHT GROUP": "",
        "Age group": "",
        "FRAME WIDTH": "",
        "LENSES Supported": "",
        "COLLECTION type": "",
        "UNIT": "",
        "TAG": "",
        "TAX": "",
        "Start QTY": "12",
        "SALE PRICE": "12500",
        "MRP/OLD PRICE": "15000",
        "IMAGE 1": "https://example.com/images/rayban-wayfarer-tortoise-1.jpg",
        "IMAGE 2": "https://example.com/images/rayban-wayfarer-tortoise-2.jpg",
        "IMAGE 3": "",
        "IMAGE 4": "",
        "IMAGE 5": "",
        "IMAGE 6": "",
        "SHORT Technical Information": "",
        "LONG Technical Information": "",
        "Publish": "",
        "Show on Website": "",
        "Where to Show": "",
        "Incentive for salesman": "",
        "Loyalty pts": "",
        "Related Products": "",
        "Keywords": "",
        "Meta Description": "",
        "Meta Title": ""
      }
    ]
    
    // Convert headers and data to worksheet
    const productsWS = XLSX.utils.json_to_sheet(productSampleData, {
      header: productHeaders
    })
    
    // Add column widths
    const wscols = productHeaders.map(() => ({ wch: 20 }))
    productsWS['!cols'] = wscols
    
    // Add Products sheet to workbook
    XLSX.utils.book_append_sheet(workbook, productsWS, "FR SG")
    
    // Create a buffer from the workbook
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=spectacles-catalog-template.xlsx"
      }
    })
  } catch (error) {
    console.error("Error generating template:", error)
    return NextResponse.json({ error: "Failed to generate template" }, { status: 500 })
  }
}