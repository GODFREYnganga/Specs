"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload, X, Palette, Layout, Globe, Eye, Image, Code } from "lucide-react"

interface AppearanceSettings {
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
  }
  layout: {
    headerStyle: "minimal" | "standard" | "full"
    footerStyle: "minimal" | "standard" | "full"
    productGridColumns: number
    showBreadcrumbs: boolean
    showSidebar: boolean
  }
  branding: {
    favicon?: string
    bannerImage?: string
    footerLogo?: string
    customCSS?: string
  }
  homepage: {
    heroSection: boolean
    featuredProducts: boolean
    testimonials: boolean
    newsletter: boolean
    aboutSection: boolean
  }
}

export default function AppearanceSettingsForm() {
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: {
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b", 
      accentColor: "#f59e0b",
      backgroundColor: "#ffffff",
      textColor: "#1f2937"
    },
    layout: {
      headerStyle: "standard",
      footerStyle: "standard",
      productGridColumns: 4,
      showBreadcrumbs: true,
      showSidebar: true
    },
    branding: {
      customCSS: ""
    },
    homepage: {
      heroSection: true,
      featuredProducts: true,
      testimonials: true,
      newsletter: true,
      aboutSection: false
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        if (data.appearance) {
          setSettings(data.appearance)
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast({
        title: "Error",
        description: "Failed to load appearance settings",
        variant: "destructive",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appearance: settings })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Appearance settings updated successfully",
        })
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error("Settings update error:", error)
      toast({
        title: "Error",
        description: "Failed to update appearance settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, type: 'favicon' | 'bannerImage' | 'footerLogo') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      // In a real app, you'd upload to your file storage service
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings(prev => ({
          ...prev,
          branding: {
            ...prev.branding,
            [type]: e.target?.result as string
          }
        }))
        toast({
          title: "Success",
          description: `${type} uploaded successfully`,
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${type}`,
        variant: "destructive",
      })
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Colors */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Theme Colors</CardTitle>
            </div>
            <CardDescription>
              Customize your brand colors and visual identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.theme.primaryColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, primaryColor: e.target.value }
                      }))
                    }
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.theme.primaryColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, primaryColor: e.target.value }
                      }))
                    }
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings.theme.secondaryColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, secondaryColor: e.target.value }
                      }))
                    }
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.theme.secondaryColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, secondaryColor: e.target.value }
                      }))
                    }
                    placeholder="#64748b"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={settings.theme.accentColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, accentColor: e.target.value }
                      }))
                    }
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.theme.accentColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, accentColor: e.target.value }
                      }))
                    }
                    placeholder="#f59e0b"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={settings.theme.backgroundColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, backgroundColor: e.target.value }
                      }))
                    }
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.theme.backgroundColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, backgroundColor: e.target.value }
                      }))
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={settings.theme.textColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, textColor: e.target.value }
                      }))
                    }
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.theme.textColor}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        theme: { ...prev.theme, textColor: e.target.value }
                      }))
                    }
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Layout className="h-5 w-5" />
              <CardTitle>Layout Settings</CardTitle>
            </div>
            <CardDescription>
              Configure the layout and structure of your storefront
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Header Style</Label>
                  <Select
                    value={settings.layout.headerStyle}
                    onValueChange={(value: "minimal" | "standard" | "full") =>
                      setSettings(prev => ({
                        ...prev,
                        layout: { ...prev.layout, headerStyle: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Footer Style</Label>
                  <Select
                    value={settings.layout.footerStyle}
                    onValueChange={(value: "minimal" | "standard" | "full") =>
                      setSettings(prev => ({
                        ...prev,
                        layout: { ...prev.layout, footerStyle: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Product Grid Columns</Label>
                  <Select
                    value={settings.layout.productGridColumns.toString()}
                    onValueChange={(value) =>
                      setSettings(prev => ({
                        ...prev,
                        layout: { ...prev.layout, productGridColumns: parseInt(value) }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                      <SelectItem value="5">5 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Show Breadcrumbs</Label>
                    <p className="text-sm text-muted-foreground">
                      Display navigation breadcrumbs
                    </p>
                  </div>
                  <Switch
                    checked={settings.layout.showBreadcrumbs}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        layout: { ...prev.layout, showBreadcrumbs: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Show Sidebar</Label>
                    <p className="text-sm text-muted-foreground">
                      Display category sidebar
                    </p>
                  </div>
                  <Switch
                    checked={settings.layout.showSidebar}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        layout: { ...prev.layout, showSidebar: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding Assets */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <CardTitle>Branding Assets</CardTitle>
            </div>
            <CardDescription>
              Upload and manage your brand assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {settings.branding.favicon ? (
                    <div className="space-y-2">
                      <img src={settings.branding.favicon} alt="Favicon" className="w-8 h-8 mx-auto" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          branding: { ...prev.branding, favicon: undefined }
                        }))}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'favicon')
                        }}
                      />
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload Favicon</p>
                    </label>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {settings.branding.bannerImage ? (
                    <div className="space-y-2">
                      <img src={settings.branding.bannerImage} alt="Banner" className="w-full h-16 object-cover rounded" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          branding: { ...prev.branding, bannerImage: undefined }
                        }))}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'bannerImage')
                        }}
                      />
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload Banner</p>
                    </label>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Footer Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {settings.branding.footerLogo ? (
                    <div className="space-y-2">
                      <img src={settings.branding.footerLogo} alt="Footer Logo" className="w-full h-16 object-cover rounded" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          branding: { ...prev.branding, footerLogo: undefined }
                        }))}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'footerLogo')
                        }}
                      />
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload Logo</p>
                    </label>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customCSS">Custom CSS</Label>
              <Textarea
                id="customCSS"
                placeholder="/* Add your custom CSS here */"
                value={settings.branding.customCSS || ""}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    branding: { ...prev.branding, customCSS: e.target.value }
                  }))
                }
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Add custom CSS to override default styles
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Homepage Sections */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Homepage Sections</CardTitle>
            </div>
            <CardDescription>
              Choose which sections to display on your homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">Hero Section</Label>
                  <p className="text-sm text-muted-foreground">
                    Large banner with call-to-action
                  </p>
                </div>
                <Switch
                  checked={settings.homepage.heroSection}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      homepage: { ...prev.homepage, heroSection: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">Featured Products</Label>
                  <p className="text-sm text-muted-foreground">
                    Showcase selected products
                  </p>
                </div>
                <Switch
                  checked={settings.homepage.featuredProducts}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      homepage: { ...prev.homepage, featuredProducts: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">Testimonials</Label>
                  <p className="text-sm text-muted-foreground">
                    Customer reviews and feedback
                  </p>
                </div>
                <Switch
                  checked={settings.homepage.testimonials}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      homepage: { ...prev.homepage, testimonials: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">Newsletter Signup</Label>
                  <p className="text-sm text-muted-foreground">
                    Email subscription form
                  </p>
                </div>
                <Switch
                  checked={settings.homepage.newsletter}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      homepage: { ...prev.homepage, newsletter: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">About Section</Label>
                  <p className="text-sm text-muted-foreground">
                    Company information
                  </p>
                </div>
                <Switch
                  checked={settings.homepage.aboutSection}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      homepage: { ...prev.homepage, aboutSection: checked }
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </form>

      {/* Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <CardTitle>Preview</CardTitle>
          </div>
          <CardDescription>
            Preview of your current appearance settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6" style={{ backgroundColor: settings.theme.backgroundColor }}>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: settings.theme.primaryColor }}
                />
                <span style={{ color: settings.theme.textColor }}>Primary Color</span>
              </div>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: settings.theme.secondaryColor }}
                />
                <span style={{ color: settings.theme.textColor }}>Secondary Color</span>
              </div>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: settings.theme.accentColor }}
                />
                <span style={{ color: settings.theme.textColor }}>Accent Color</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
