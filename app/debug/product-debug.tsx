"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductDebugPage() {
  const [productId, setProductId] = useState("")
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = async () => {
    if (!productId.trim()) {
      setError("Please enter a product ID")
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/eyewear-products/${productId}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch product: ${res.statusText}`)
      }
      const data = await res.json()
      setProduct(data)
      console.log("Product data:", data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Product Debug Tool</h1>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Enter product ID"
          className="px-4 py-2 border rounded-md flex-1"
        />
        <Button onClick={fetchProduct} disabled={loading}>
          {loading ? "Loading..." : "Fetch Product"}
        </Button>
      </div>
      
      {error && <div className="text-red-500 mb-6">{error}</div>}
      
      {product && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>Product ID: {product._id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Basic Info</h3>
                  <div className="space-y-1">
                    <p><span className="font-medium">Price:</span> KSh {product.price}</p>
                    <p><span className="font-medium">Category:</span> {product.category}</p>
                    <p><span className="font-medium">Brand:</span> {product.brand || product.brand_name || "-"}</p>
                  </div>
                </div>
                <div>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-w-full h-auto rounded border"
                      style={{ maxHeight: "150px" }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Main Description</h3>
                  <p className="text-gray-700">
                    {product.product_description || 
                     product.description || 
                     (product.data && product.data.Description) || 
                     "No description available"}
                  </p>
                </div>
                
                {(product.short_technical_info || 
                  product.short_technical_information || 
                  (product.data && product.data['SHORT Technical Information'])) && (
                  <div>
                    <h3 className="font-semibold">Technical Information</h3>
                    <p className="text-gray-700">
                      {product.short_technical_info || 
                       product.short_technical_information || 
                       (product.data && product.data['SHORT Technical Information'])}
                    </p>
                  </div>
                )}
                
                {(product.long_technical_info || 
                  product.long_technical_information || 
                  (product.data && product.data['LONG Technical Information'])) && (
                  <div>
                    <h3 className="font-semibold">Detailed Information</h3>
                    <p className="text-gray-700">
                      {product.long_technical_info || 
                       product.long_technical_information || 
                       (product.data && product.data['LONG Technical Information'])}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries({
                  "Frame Shape": product.shape || product.frameShape,
                  "Frame Type": product.frame_type || product.frameType,
                  "Material": product.material,
                  "Gender": product.gender,
                  "Size": product.size,
                  "Weight": product.weight,
                  "Brand": product.brand || product.brand_name || product.brandName,
                  "Color": product.color
                })
                  .filter(([_, value]) => value)
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">{key}</span>
                      <span className="font-semibold">{String(value)}</span>
                    </div>
                  ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Additional Fields</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.data && Object.entries(product.data)
                    .filter(([key]) => ![
                      'Description', 
                      'SHORT Technical Information', 
                      'LONG Technical Information',
                      'IMAGE 1', 'IMAGE 2', 'IMAGE 3', 'IMAGE 4', 'IMAGE 5', 'IMAGE 6',
                      'shape', 'frameShape', 'frame_type', 'frameType', 'material',
                      'gender', 'size', 'weight', 'brand', 'brand_name', 'brandName',
                      'color'
                    ].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">{key}</span>
                        <span className="font-semibold">{String(value)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Raw Data</CardTitle>
              <CardDescription>Developer view of all product data</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(product, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
