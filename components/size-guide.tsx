"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Ruler, Eye, User, Info } from "lucide-react"

export function SizeGuide() {
  const [selectedSize, setSelectedSize] = useState("")

  const frameSizes = [
    { name: "XS", width: "125-130mm", bridge: "14-16mm", temple: "135mm", fit: "Narrow faces" },
    { name: "S", width: "130-135mm", bridge: "16-18mm", temple: "140mm", fit: "Small to medium faces" },
    { name: "M", width: "135-140mm", bridge: "18-20mm", temple: "145mm", fit: "Medium faces" },
    { name: "L", width: "140-145mm", bridge: "20-22mm", temple: "150mm", fit: "Large faces" },
    { name: "XL", width: "145-150mm", bridge: "22-24mm", temple: "155mm", fit: "Very large faces" },
  ]

  const measurementGuide = [
    {
      title: "Frame Width",
      description: "Total width of the front frame",
      icon: <Ruler className="h-4 w-4" />,
      tip: "Should not extend beyond your face width"
    },
    {
      title: "Bridge Width", 
      description: "Distance between the lenses",
      icon: <Eye className="h-4 w-4" />,
      tip: "Should sit comfortably on your nose"
    },
    {
      title: "Temple Length",
      description: "Length of the side arms",
      icon: <User className="h-4 w-4" />,
      tip: "Should reach behind your ears without pressure"
    }
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Ruler className="h-4 w-4 mr-2" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Eyewear Size Guide</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="sizes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sizes">Frame Sizes</TabsTrigger>
            <TabsTrigger value="measurements">How to Measure</TabsTrigger>
            <TabsTrigger value="fit">Perfect Fit Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sizes" className="space-y-4">
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Choose Your Size</h3>
              <div className="grid gap-3">
                {frameSizes.map((size) => (
                  <Card 
                    key={size.name}
                    className={`cursor-pointer transition-colors ${
                      selectedSize === size.name ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedSize(size.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={selectedSize === size.name ? "default" : "secondary"}>
                            {size.name}
                          </Badge>
                          <div className="text-sm">
                            <div className="font-medium">{size.fit}</div>
                            <div className="text-muted-foreground">
                              Width: {size.width} • Bridge: {size.bridge} • Temple: {size.temple}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="measurements" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How to Measure Your Face</h3>
              
              <div className="grid gap-4">
                {measurementGuide.map((guide, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {guide.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{guide.title}</h4>
                          <p className="text-sm text-muted-foreground">{guide.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Info className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-blue-600">{guide.tip}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Measurement Visual Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Visual Measurement Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-50 rounded-lg p-8 text-center">
                    <div className="inline-block relative">
                      {/* Simple SVG representation of glasses measurements */}
                      <svg width="200" height="80" viewBox="0 0 200 80" className="text-gray-600">
                        {/* Frame outline */}
                        <ellipse cx="50" cy="40" rx="25" ry="20" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <ellipse cx="150" cy="40" rx="25" ry="20" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <line x1="75" y1="40" x2="125" y2="40" stroke="currentColor" strokeWidth="2"/>
                        <line x1="25" y1="40" x2="15" y2="50" stroke="currentColor" strokeWidth="2"/>
                        <line x1="175" y1="40" x2="185" y2="50" stroke="currentColor" strokeWidth="2"/>
                        
                        {/* Measurement lines */}
                        <line x1="25" y1="65" x2="175" y2="65" stroke="red" strokeWidth="1" strokeDasharray="2,2"/>
                        <text x="100" y="75" textAnchor="middle" className="text-xs fill-red-600">Frame Width</text>
                        
                        <line x1="75" y1="25" x2="125" y2="25" stroke="blue" strokeWidth="1" strokeDasharray="2,2"/>
                        <text x="100" y="20" textAnchor="middle" className="text-xs fill-blue-600">Bridge Width</text>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="fit" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Perfect Fit Checklist</h3>
              
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-green-600">✓ Good Fit Indicators</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Frames sit evenly on your nose without sliding</li>
                        <li>• No pinching or pressure on your temples</li>
                        <li>• Arms rest comfortably behind your ears</li>
                        <li>• Lenses are centered over your pupils</li>
                        <li>• Frame width matches your face width</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-red-600">✗ Poor Fit Signs</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Glasses slide down your nose constantly</li>
                        <li>• Red marks or indentations on your nose or temples</li>
                        <li>• Arms are too tight or too loose</li>
                        <li>• Frame extends beyond your face width</li>
                        <li>• Headaches after wearing for extended periods</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Professional Fitting Available</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Not sure about your size? Visit our store for a professional fitting, 
                          or use our virtual try-on feature to see how frames look on your face.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
