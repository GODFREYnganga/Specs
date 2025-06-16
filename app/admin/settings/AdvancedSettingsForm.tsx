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
import { Loader2, AlertTriangle, Download, Upload } from "lucide-react"

interface AdvancedSettings {
  performance: {
    enableCaching: boolean
    cacheExpiration: number
    enableImageOptimization: boolean
    enableLazyLoading: boolean
    enableCompression: boolean
  }
  security: {
    enableSSL: boolean
    enableCORS: boolean
    allowedOrigins: string
    enableRateLimit: boolean
    rateLimitRequests: number
    enableCSP: boolean
    cspDirectives: string
  }
  backup: {
    enableAutoBackup: boolean
    backupFrequency: "daily" | "weekly" | "monthly"
    retentionPeriod: number
    backupLocation: "local" | "cloud" | "both"
  }
  api: {
    enableRestAPI: boolean
    enableWebhooks: boolean
    apiRateLimit: number
    enableAPILogging: boolean
    requireAuthentication: boolean
  }
  maintenance: {
    maintenanceMode: boolean
    maintenanceMessage: string
    allowedIPs: string
    scheduledMaintenance?: string
  }
  logging: {
    enableAccessLogs: boolean
    enableErrorLogs: boolean
    logLevel: "debug" | "info" | "warn" | "error"
    maxLogSize: number
    logRetention: number
  }
}

export default function AdvancedSettingsForm() {
  const [settings, setSettings] = useState<AdvancedSettings>({
    performance: {
      enableCaching: true,
      cacheExpiration: 3600,
      enableImageOptimization: true,
      enableLazyLoading: true,
      enableCompression: true
    },
    security: {
      enableSSL: true,
      enableCORS: false,
      allowedOrigins: "*",
      enableRateLimit: true,
      rateLimitRequests: 100,
      enableCSP: false,
      cspDirectives: "default-src 'self'"
    },
    backup: {
      enableAutoBackup: false,
      backupFrequency: "weekly",
      retentionPeriod: 30,
      backupLocation: "local"
    },
    api: {
      enableRestAPI: true,
      enableWebhooks: false,
      apiRateLimit: 1000,
      enableAPILogging: true,
      requireAuthentication: true
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: "We are currently performing scheduled maintenance. Please check back soon.",
      allowedIPs: "",
      scheduledMaintenance: ""
    },
    logging: {
      enableAccessLogs: true,
      enableErrorLogs: true,
      logLevel: "info",
      maxLogSize: 100,
      logRetention: 30
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [backupLoading, setBackupLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        if (data.advanced) {
          setSettings(data.advanced)
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast.error("Failed to load advanced settings")
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
        body: JSON.stringify({ advanced: settings })
      })

      if (response.ok) {
        toast.success("Advanced settings updated successfully")
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error("Settings update error:", error)
      toast.error("Failed to update advanced settings")
    } finally {
      setLoading(false)
    }
  }

  async function createBackup() {
    setBackupLoading(true)
    try {
      const response = await fetch("/api/backup", {
        method: "POST"
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Backup created successfully")
      } else {
        throw new Error("Failed to create backup")
      }
    } catch (error) {
      console.error("Backup error:", error)
      toast.error("Failed to create backup")
    } finally {
      setBackupLoading(false)
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
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Advanced Settings</h3>
            <p className="text-sm text-yellow-700 mt-1">
              These settings can affect your store's performance and security. Please modify with caution.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
          <CardDescription>
            Optimize your store's performance and loading speed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Caching</Label>
              <p className="text-sm text-muted-foreground">
                Cache responses to improve performance
              </p>
            </div>
            <Switch
              checked={settings.performance.enableCaching}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  performance: { ...prev.performance, enableCaching: checked }
                }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cacheExpiration">Cache Expiration (seconds)</Label>
            <Input
              id="cacheExpiration"
              type="number"
              value={settings.performance.cacheExpiration}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  performance: { ...prev.performance, cacheExpiration: parseInt(e.target.value) || 3600 }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Image Optimization</Label>
              <p className="text-sm text-muted-foreground">
                Automatically optimize images for web
              </p>
            </div>
            <Switch
              checked={settings.performance.enableImageOptimization}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  performance: { ...prev.performance, enableImageOptimization: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lazy Loading</Label>
              <p className="text-sm text-muted-foreground">
                Load images only when they come into view
              </p>
            </div>
            <Switch
              checked={settings.performance.enableLazyLoading}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  performance: { ...prev.performance, enableLazyLoading: checked }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Configure security settings for your store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Rate Limiting</Label>
              <p className="text-sm text-muted-foreground">
                Limit requests per IP to prevent abuse
              </p>
            </div>
            <Switch
              checked={settings.security.enableRateLimit}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, enableRateLimit: checked }
                }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rateLimitRequests">Rate Limit (requests per hour)</Label>
            <Input
              id="rateLimitRequests"
              type="number"
              value={settings.security.rateLimitRequests}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, rateLimitRequests: parseInt(e.target.value) || 100 }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable CORS</Label>
              <p className="text-sm text-muted-foreground">
                Allow cross-origin requests from other domains
              </p>
            </div>
            <Switch
              checked={settings.security.enableCORS}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, enableCORS: checked }
                }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allowedOrigins">Allowed Origins</Label>
            <Input
              id="allowedOrigins"
              value={settings.security.allowedOrigins}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, allowedOrigins: e.target.value }
                }))
              }
              placeholder="*"
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of allowed origins. Use * for all.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
          <CardDescription>
            Configure automatic backups and data protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup your store data
              </p>
            </div>
            <Switch
              checked={settings.backup.enableAutoBackup}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  backup: { ...prev.backup, enableAutoBackup: checked }
                }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label>Backup Frequency</Label>
            <Select
              value={settings.backup.backupFrequency}
              onValueChange={(value: "daily" | "weekly" | "monthly") =>
                setSettings(prev => ({
                  ...prev,
                  backup: { ...prev.backup, backupFrequency: value }
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
            <Input
              id="retentionPeriod"
              type="number"
              value={settings.backup.retentionPeriod}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  backup: { ...prev.backup, retentionPeriod: parseInt(e.target.value) || 30 }
                }))
              }
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={createBackup}
              disabled={backupLoading}
              className="flex-1"
            >
              {backupLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Create Backup Now
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Restore Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>
            Temporarily disable your store for maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Show maintenance page to visitors
              </p>
            </div>
            <Switch
              checked={settings.maintenance.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  maintenance: { ...prev.maintenance, maintenanceMode: checked }
                }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
            <Textarea
              id="maintenanceMessage"
              value={settings.maintenance.maintenanceMessage}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  maintenance: { ...prev.maintenance, maintenanceMessage: e.target.value }
                }))
              }
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
            <Input
              id="allowedIPs"
              value={settings.maintenance.allowedIPs}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  maintenance: { ...prev.maintenance, allowedIPs: e.target.value }
                }))
              }
              placeholder="192.168.1.1, 10.0.0.1"
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated IP addresses that can access the store during maintenance
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>
            Configure API access and rate limiting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable REST API</Label>
              <p className="text-sm text-muted-foreground">
                Allow API access to your store data
              </p>
            </div>
            <Switch
              checked={settings.api.enableRestAPI}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  api: { ...prev.api, enableRestAPI: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Require API keys for access
              </p>
            </div>
            <Switch
              checked={settings.api.requireAuthentication}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  api: { ...prev.api, requireAuthentication: checked }
                }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiRateLimit">API Rate Limit (requests per hour)</Label>
            <Input
              id="apiRateLimit"
              type="number"
              value={settings.api.apiRateLimit}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  api: { ...prev.api, apiRateLimit: parseInt(e.target.value) || 1000 }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Advanced Settings
      </Button>
    </form>
  )
}