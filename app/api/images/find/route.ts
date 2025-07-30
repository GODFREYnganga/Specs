import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get('path')
    
    if (!imagePath) {
      return NextResponse.json({ error: 'No image path provided' }, { status: 400 })
    }

    // Extract the filename from the database path
    const filename = imagePath.split('/').pop()
    if (!filename) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 400 })
    }

    // Define the directory to search in
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'eyewear-products')
    
    try {
      // Read all files in the directory
      const files = await fs.readdir(imagesDir)
      
      // Try to find a file that contains the base filename
      // This handles cases where files have timestamp prefixes
      const matchingFile = files.find(file => {
        // Remove common prefixes and check if the original filename is contained
        const cleanFilename = filename.replace(/^\d+-/, '') // Remove timestamp prefix if present
        return file.includes(cleanFilename) || file.endsWith(filename)
      })

      if (matchingFile) {
        const correctedPath = `/images/eyewear-products/${matchingFile}`
        return NextResponse.json({ 
          found: true, 
          originalPath: imagePath,
          correctedPath: correctedPath 
        })
      } else {
        return NextResponse.json({ 
          found: false, 
          originalPath: imagePath,
          correctedPath: '/placeholder.svg',
          availableFiles: files.slice(0, 5) // Return first 5 files for debugging
        })
      }
    } catch (error) {
      console.error('Error reading images directory:', error)
      return NextResponse.json({ 
        found: false, 
        originalPath: imagePath,
        correctedPath: '/placeholder.svg',
        error: 'Could not read images directory'
      })
    }
  } catch (error) {
    console.error('Error in image find API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
