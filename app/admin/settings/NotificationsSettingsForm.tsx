"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface NotificationSettings {
  emailNotifications: {
    orderConfirmation: boolean
    orderStatusUpdate: boolean
    lowStockAlert: boolean
    customerMessages: boolean
    marketingEmails: boolean
  }
  smsNotifications: {
    orderConfirmation: boolean
    orderStatusUpdate: boolean
    lowStockAlert: boolean
  }
  webhookUrl?: string
  slackWebhook?: string
}

export default function NotificationsSettingsForm() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      orderConfirmation: true,
      orderStatusUpdate: true,
      lowStockAlert: true,
      customerMessages: true,
      marketingEmails: false
    },
    smsNotifications: {
      orderConfirmation: false,
      orderStatusUpdate: false,
      lowStockAlert: true
    },
    webhookUrl: "",
    slackWebhook: ""
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
        if (data.notifications) {
          setSettings(data.notifications)
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast.error("Failed to load notification settings")
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
        body: JSON.stringify({ notifications: settings })
      })

      if (response.ok) {
        toast.success("Notification settings updated successfully")
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error("Settings update error:", error)
      toast.error("Failed to update notification settings")
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
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure which email notifications to send to administrators and customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Confirmation</Label>
              <p className="text-sm text-muted-foreground">
                Send email when orders are placed
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.orderConfirmation}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    orderConfirmation: checked
                  }
                }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Status Updates</Label>
              <p className="text-sm text-muted-foreground">
                Send email when order status changes
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.orderStatusUpdate}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    orderStatusUpdate: checked
                  }
                }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Send email when products are running low
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.lowStockAlert}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    lowStockAlert: checked
                  }
                }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Customer Messages</Label>
              <p className="text-sm text-muted-foreground">
                Send email for customer support messages
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.customerMessages}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    customerMessages: checked
                  }
                }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Send promotional and marketing emails
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.marketingEmails}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    marketingEmails: checked
                  }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>
            Configure SMS notifications for critical events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Confirmation</Label>
              <p className="text-sm text-muted-foreground">
                Send SMS when orders are placed
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications.orderConfirmation}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  smsNotifications: {
                    ...prev.smsNotifications,
                    orderConfirmation: checked
                  }
                }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Status Updates</Label>
              <p className="text-sm text-muted-foreground">
                Send SMS when order status changes
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications.orderStatusUpdate}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  smsNotifications: {
                    ...prev.smsNotifications,
                    orderStatusUpdate: checked
                  }
                }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Send SMS when products are running low
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications.lowStockAlert}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  smsNotifications: {
                    ...prev.smsNotifications,
                    lowStockAlert: checked
                  }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>
            Configure webhooks and third-party integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              type="url"
              placeholder="https://your-app.com/webhook"
              value={settings.webhookUrl || ""}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  webhookUrl: e.target.value
                }))
              }
            />
            <p className="text-sm text-muted-foreground">
              URL to receive order and product webhooks
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
            <Input
              id="slackWebhook"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={settings.slackWebhook || ""}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  slackWebhook: e.target.value
                }))
              }
            />
            <p className="text-sm text-muted-foreground">
              Send important notifications to Slack
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Notification Settings
      </Button>
    </form>
  )
}