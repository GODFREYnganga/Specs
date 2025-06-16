"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Upload, X } from "lucide-react"

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
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)

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
      toast.error("Failed to load appearance settings")
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
        toast.success("Appearance settings updated successfully")
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error("Settings update error:", error)
      toast.error("Failed to update appearance settings")
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(file: File, field: keyof AppearanceSettings['branding']) {
    setUploadingFile(field)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('field', field)
      
      const response = await fetch("/api/settings", {
        method: "POST",
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({
          ...prev,
          branding: {
            ...prev.branding,
            [field]: data.filePath
          }
        }))
        toast.success("File uploaded successfully")
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setUploadingFile(null)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
          <CardDescription>
            Customize your store's color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
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
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
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
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex gap-2">
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
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2">
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
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Settings</CardTitle>
          <CardDescription>
            Configure your store's layout and structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Breadcrumbs</Label>
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
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Sidebar</Label>
                <p className="text-sm text-muted-foreground">
                  Display sidebar on product pages
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections</CardTitle>
          <CardDescription>
            Choose which sections to display on your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hero Section</Label>
              <p className="text-sm text-muted-foreground">
                Main banner with featured content
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
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Featured Products</Label>
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
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Testimonials</Label>
              <p className="text-sm text-muted-foreground">
                Customer reviews and testimonials
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
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Newsletter Signup</Label>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Styling</CardTitle>
          <CardDescription>
            Add custom CSS to further customize your store's appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              Advanced users can add custom CSS to override default styles
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Appearance Settings
      </Button>
    </form>
  )
}