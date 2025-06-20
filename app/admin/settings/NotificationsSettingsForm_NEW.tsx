"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, MessageSquare, Webhook } from "lucide-react";

export default function NotificationsSettingsForm() {
  const [form, setForm] = useState({
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
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) {
          setForm(data.notifications);
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add notification settings with proper nested structure
      Object.entries(form).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`notifications.${key}.${subKey}`, subValue.toString());
          });
        } else {
          formData.append(`notifications.${key}`, value.toString());
        }
      });

      const res = await fetch("/api/settings", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Notification settings saved successfully",
        });
        fetchSettings(); // Refresh data
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure email, SMS, and webhook notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <Label className="text-base font-medium">Email Notifications</Label>
            </div>
            
            <div className="grid gap-4 pl-7">
              <div className="flex items-center justify-between">
                <Label>Order Confirmation</Label>
                <Switch
                  checked={form.emailNotifications.orderConfirmation}
                  onCheckedChange={(checked) =>
                    setForm(f => ({
                      ...f,
                      emailNotifications: { ...f.emailNotifications, orderConfirmation: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Order Status Updates</Label>
                <Switch
                  checked={form.emailNotifications.orderStatusUpdate}
                  onCheckedChange={(checked) =>
                    setForm(f => ({
                      ...f,
                      emailNotifications: { ...f.emailNotifications, orderStatusUpdate: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Low Stock Alerts</Label>
                <Switch
                  checked={form.emailNotifications.lowStockAlert}
                  onCheckedChange={(checked) =>
                    setForm(f => ({
                      ...f,
                      emailNotifications: { ...f.emailNotifications, lowStockAlert: checked }
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <Label className="text-base font-medium">SMS Notifications</Label>
            </div>
            
            <div className="grid gap-4 pl-7">
              <div className="flex items-center justify-between">
                <Label>Order Confirmation</Label>
                <Switch
                  checked={form.smsNotifications.orderConfirmation}
                  onCheckedChange={(checked) =>
                    setForm(f => ({
                      ...f,
                      smsNotifications: { ...f.smsNotifications, orderConfirmation: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Low Stock Alerts</Label>
                <Switch
                  checked={form.smsNotifications.lowStockAlert}
                  onCheckedChange={(checked) =>
                    setForm(f => ({
                      ...f,
                      smsNotifications: { ...f.smsNotifications, lowStockAlert: checked }
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Webhooks */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Webhook className="h-5 w-5" />
              <Label className="text-base font-medium">Webhook Integration</Label>
            </div>
            
            <div className="grid gap-4 pl-7">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={form.webhookUrl}
                  onChange={e => setForm(f => ({ ...f, webhookUrl: e.target.value }))}
                  placeholder="https://your-app.com/webhook"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                <Input
                  id="slackWebhook"
                  type="url"
                  value={form.slackWebhook}
                  onChange={e => setForm(f => ({ ...f, slackWebhook: e.target.value }))}
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Notification Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
