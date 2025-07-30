'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Upload, Eye, CheckCircle, XCircle, Filter, Package, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { handleApiResponse } from './helpers'

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
  [key: string]: any // Add index signature
}

interface ProcessResult {
  success: boolean
  productsProcessed: number
  filtersProcessed: number
  errors: number
  total: number
  errorDetails: any[]
  message: string
}

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [productPreview, setProductPreview] = useState<ProductPreview[]>([])
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null)
  const [error, setError] = useState<string>('')
  const [page, setPage] = useState(0)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const { toast } = useToast()
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Please select a valid Excel file (.xlsx or .xls)')
        return
      }
      setFile(selectedFile)
      setProductPreview([])
      setProcessResult(null)
      setError('')
    }
  }

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setImageFiles(selectedFiles)
  }

  const handleImageUpload = async () => {
    if (imageFiles.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select images to upload",
        variant: "destructive",
      })
      return
    }

    setUploadingImages(true)

    try {
      const formData = new FormData()
      imageFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/images/bulk-upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const uploadedPaths = data.files.map((file: any) => file.url)
        setUploadedImages(uploadedPaths)
        toast({
          title: "Success",
          description: `${data.files.length} images uploaded successfully to /images/eyewear-products/`,
        })
      } else {
        throw new Error('Failed to upload images')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const clearUploadedImages = () => {
    setUploadedImages([])
    setImageFiles([])
  }

  const handlePreview = async () => {
    if (!file) return

    setIsPreviewLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/products/bulk-upload/preview', {
        method: 'POST',
        body: formData,
      })

      // Handle non-JSON responses properly
      if (!response.ok) {
        const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to preview file')
        } else {
          // If not JSON, get text and create a more helpful error
          const errorText = await response.text()
          // Extract a useful part of the HTML error
          const errorMatch = errorText.match(/<pre>([\s\S]*?)<\/pre>/)
          const errorSummary = errorMatch ? errorMatch[1] : errorText.substring(0, 100)
          throw new Error(`Server error (${response.status}): ${errorSummary}`)
        }
      }
      
      const data = await response.json()
      setProductPreview(data.products || [])
      
      toast({
        title: "Preview Loaded",
        description: `Found ${data.products?.length || 0} products`,
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Preview Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const handleProcess = async () => {
    if (!file) return

    setIsProcessing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/products/bulk-upload/process', {
        method: 'POST',
        body: formData,
      })

      // Handle non-JSON responses properly
      if (!response.ok) {
        const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to process file')
        } else {
          // If not JSON, get text and create a more helpful error
          const errorText = await response.text()
          // Extract a useful part of the HTML error
          const errorMatch = errorText.match(/<pre>([\s\S]*?)<\/pre>/)
          const errorSummary = errorMatch ? errorMatch[1] : errorText.substring(0, 100)
          throw new Error(`Server error (${response.status}): ${errorSummary}`)
        }
      }

      const result = await response.json()
      setProcessResult(result)
      toast({
        title: "Upload Complete",
        description: `Processed ${result.productsProcessed} products`,
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Processing Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    const link = document.createElement('a')
    link.href = '/api/products/bulk-upload/template'
    link.download = 'spectacles-catalog-template.xlsx'
    link.click()
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold">Bulk Upload Product Catalog</h1>
        <p className="text-gray-600 mt-2">Upload complete product catalog with variations and filters using Excel (.xlsx) files</p>
      </div>      {/* Template Download */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Template
          </CardTitle>
          <CardDescription>
            Download the Excel template containing all required fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Excel Template
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            The template includes sample data to help you understand the format
          </p>
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Upload Product Images
          </CardTitle>
          <CardDescription>
            Upload images to the eyewear-products folder. Images will be saved to /public/images/eyewear-products/
            Use the generated paths in your Excel file's "Images" column.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Product Images (Multiple files allowed)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFilesChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {imageFiles.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {imageFiles.length} image(s) selected: {imageFiles.map(f => f.name).join(', ')}
              </p>
            )}
          </div>

          <Button
            onClick={handleImageUpload}
            disabled={imageFiles.length === 0 || uploadingImages}
            variant="outline"
            className="w-full bg-green-50 hover:bg-green-100 border-green-200"
          >
            {uploadingImages ? "Uploading Images..." : "Upload Images to Server"}
          </Button>

          {uploadedImages.length > 0 && (
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-green-800">Successfully Uploaded Images:</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearUploadedImages}
                >
                  Clear List
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {uploadedImages.map((imagePath, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm font-mono text-gray-700 flex-1 truncate">{imagePath}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(imagePath)}
                    >
                      Copy Path
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-700 mt-2">
                Use these paths in your Excel file's "Images" column (comma-separated for multiple images per product)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="mb-6">        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Excel File
          </CardTitle>
          <CardDescription>
            Select an Excel file (.xlsx) containing both product catalog and filters data.
            Images referenced in the Excel file should be placed in the /public/images/eyewear-products/ folder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {file && (
              <div className="flex gap-2">
                <Button 
                  onClick={handlePreview} 
                  disabled={isPreviewLoading}
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isPreviewLoading ? 'Loading Preview...' : 'Preview Data'}
                </Button>
                  {productPreview.length > 0 && (
                  <Button 
                    onClick={handleProcess} 
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? 'Processing...' : `Process ${productPreview.length} Products`}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing products and filters...</span>
                <span>Please wait, this may take a few minutes</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Result */}
      {processResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Upload Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{processResult.productsProcessed}</div>
                <div className="text-sm text-gray-500">Products</div>
              </div>                <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{processResult.errors}</div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{processResult.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {processResult.total > 0 ? Math.round((processResult.productsProcessed / processResult.total) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{processResult.message}</p>
            
            {processResult.errorDetails && processResult.errorDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Error Details:</h4>
                <div className="max-h-60 overflow-y-auto">
                  {processResult.errorDetails.map((error, index) => (
                    <div key={index} className="text-sm p-2 bg-red-50 border border-red-200 rounded mb-2">
                      <strong>Sheet: {error.sheet}, Row {error.row}:</strong> {error.error}
                      {error.sku && <span className="ml-2 text-gray-600">(SKU: {error.sku})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}      {/* Preview Tabs */}
      {productPreview.length > 0 && (
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products ({productPreview.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
                <CardDescription>
                  Preview of products from Excel file. Use Next/Previous to view all rows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {/* Pagination logic moved out of render function */}
                  {(() => {
                    const pageSize = 10;
                    const totalPages = Math.ceil(productPreview.length / pageSize);
                    // Collect all unique keys from the previewed products
                    const allKeys = Array.from(
                      new Set(productPreview.flatMap((p) => Object.keys(p)))
                    );
                    const paginated = productPreview.slice(page * pageSize, (page + 1) * pageSize);
                    return (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {allKeys.map((key) => (
                                <TableHead key={key}>{key}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginated.map((product, index) => (
                              <TableRow key={index}>
                                {allKeys.map((key) => (
                                  <TableCell key={key} className="max-w-xs truncate">
                                    {typeof product[key] === 'object' && product[key] !== null
                                      ? JSON.stringify(product[key])
                                      : String(product[key] ?? '')}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="flex justify-between items-center mt-4">
                          <Button
                            variant="outline"
                            disabled={page === 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-gray-600">
                            Page {page + 1} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
