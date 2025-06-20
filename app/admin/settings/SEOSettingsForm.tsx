"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Loader2, ExternalLink } from "lucide-react"

interface SEOSettings {
  general: {
    siteTitle: string
    metaDescription: string
    metaKeywords: string
    robotsTxt: string
    googleAnalyticsId?: string
    googleTagManagerId?: string
    facebookPixelId?: string
  }
  socialMedia: {
    ogTitle: string
    ogDescription: string
    ogImage?: string
    twitterCard: "summary" | "summary_large_image"
    twitterSite?: string
    twitterCreator?: string
  }
  structured: {
    enableSchemaMarkup: boolean
    organizationName: string
    organizationType: "Organization" | "LocalBusiness" | "Corporation" | "EducationalOrganization"
    contactPoint: {
      telephone: string
      contactType: string
      areaServed: string
    }
  }
  sitemap: {
    enableXmlSitemap: boolean
    includeProducts: boolean
    includeCategories: boolean
    includeBlogPosts: boolean
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  }
}

export default function SEOSettingsForm() {
  const [settings, setSettings] = useState<SEOSettings>({
    general: {
      siteTitle: "Spectacles Store",
      metaDescription: "Premium eyewear and spectacles for every style and need",
      metaKeywords: "spectacles, eyewear, glasses, sunglasses, prescription glasses",
      robotsTxt: "User-agent: *\nDisallow: /admin/\nDisallow: /api/\nSitemap: /sitemap.xml",
      googleAnalyticsId: "",
      googleTagManagerId: "",
      facebookPixelId: ""
    },
    socialMedia: {
      ogTitle: "Spectacles Store - Premium Eyewear",
      ogDescription: "Discover our premium collection of eyewear and spectacles",
      twitterCard: "summary_large_image",
      twitterSite: "",
      twitterCreator: ""
    },
    structured: {
      enableSchemaMarkup: true,
      organizationName: "Spectacles Store",
      organizationType: "LocalBusiness",
      contactPoint: {
        telephone: "",
        contactType: "customer service",
        areaServed: "US"
      }
    },
    sitemap: {
      enableXmlSitemap: true,
      includeProducts: true,
      includeCategories: true,
      includeBlogPosts: false,
      changeFrequency: "weekly"
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
        if (data.seo) {
          setSettings(data.seo)
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast({
        title: "Error",
        description: "Failed to load SEO settings",
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
        body: JSON.stringify({ seo: settings })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "SEO settings updated successfully",
        })
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error("Settings update error:", error)
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
          <CardTitle>General SEO Settings</CardTitle>
          <CardDescription>
            Basic SEO configuration for your store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Site Title</Label>
            <Input
              id="siteTitle"
              value={settings.general.siteTitle}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, siteTitle: e.target.value }
                }))
              }
              placeholder="Your Store Name"
            />
            <p className="text-sm text-muted-foreground">
              This will be used as the default page title
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={settings.general.metaDescription}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, metaDescription: e.target.value }
                }))
              }
              placeholder="A brief description of your store"
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              160 characters max. This appears in search results.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              id="metaKeywords"
              value={settings.general.metaKeywords}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, metaKeywords: e.target.value }
                }))
              }
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated keywords relevant to your store
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="robotsTxt">Robots.txt Content</Label>
            <Textarea
              id="robotsTxt"
              value={settings.general.robotsTxt}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, robotsTxt: e.target.value }
                }))
              }
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              Instructions for search engine crawlers
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
          <CardDescription>
            Configure tracking codes for analytics platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input
              id="googleAnalyticsId"
              value={settings.general.googleAnalyticsId || ""}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, googleAnalyticsId: e.target.value }
                }))
              }
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
            <Input
              id="googleTagManagerId"
              value={settings.general.googleTagManagerId || ""}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, googleTagManagerId: e.target.value }
                }))
              }
              placeholder="GTM-XXXXXXX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
            <Input
              id="facebookPixelId"
              value={settings.general.facebookPixelId || ""}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, facebookPixelId: e.target.value }
                }))
              }
              placeholder="123456789012345"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Configure how your store appears when shared on social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ogTitle">Open Graph Title</Label>
            <Input
              id="ogTitle"
              value={settings.socialMedia.ogTitle}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, ogTitle: e.target.value }
                }))
              }
              placeholder="Your Store Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ogDescription">Open Graph Description</Label>
            <Textarea
              id="ogDescription"
              value={settings.socialMedia.ogDescription}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, ogDescription: e.target.value }
                }))
              }
              placeholder="Description for social media shares"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twitterSite">Twitter Site Handle</Label>
            <Input
              id="twitterSite"
              value={settings.socialMedia.twitterSite || ""}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, twitterSite: e.target.value }
                }))
              }
              placeholder="@yourstore"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Structured Data</CardTitle>
          <CardDescription>
            Configure schema markup for better search engine understanding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Schema Markup</Label>
              <p className="text-sm text-muted-foreground">
                Add structured data to improve search results
              </p>
            </div>
            <Switch
              checked={settings.structured.enableSchemaMarkup}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  structured: { ...prev.structured, enableSchemaMarkup: checked }
                }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              value={settings.structured.organizationName}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  structured: { ...prev.structured, organizationName: e.target.value }
                }))
              }
              placeholder="Your Business Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactTelephone">Contact Telephone</Label>
            <Input
              id="contactTelephone"
              value={settings.structured.contactPoint.telephone}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  structured: {
                    ...prev.structured,
                    contactPoint: {
                      ...prev.structured.contactPoint,
                      telephone: e.target.value
                    }
                  }
                }))
              }
              placeholder="+1-555-123-4567"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>XML Sitemap</CardTitle>
          <CardDescription>
            Configure automatic sitemap generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable XML Sitemap</Label>
              <p className="text-sm text-muted-foreground">
                Automatically generate and update sitemap.xml
              </p>
            </div>
            <Switch
              checked={settings.sitemap.enableXmlSitemap}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  sitemap: { ...prev.sitemap, enableXmlSitemap: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Products</Label>
              <p className="text-sm text-muted-foreground">
                Include product pages in sitemap
              </p>
            </div>
            <Switch
              checked={settings.sitemap.includeProducts}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  sitemap: { ...prev.sitemap, includeProducts: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Categories</Label>
              <p className="text-sm text-muted-foreground">
                Include category pages in sitemap
              </p>
            </div>
            <Switch
              checked={settings.sitemap.includeCategories}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  sitemap: { ...prev.sitemap, includeCategories: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span>Sitemap will be available at /sitemap.xml</span>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save SEO Settings
      </Button>
    </form>
  )
}