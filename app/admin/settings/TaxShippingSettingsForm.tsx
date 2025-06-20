"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Calculator, Truck } from "lucide-react";

interface TaxShippingSettings {
  taxRate: number;
  defaultShippingCost: number;
  freeShippingThreshold: number;
  expressShippingCost: number;
}

export default function TaxShippingSettingsForm() {
  const [form, setForm] = useState<TaxShippingSettings>({
    taxRate: 16,
    defaultShippingCost: 500,
    freeShippingThreshold: 5000,
    expressShippingCost: 1000,
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
        const settings = await res.json();
        const taxShipping = settings.taxShipping || {};
        setForm({
          taxRate: taxShipping.taxRate || 16,
          defaultShippingCost: taxShipping.defaultShippingCost || 500,
          freeShippingThreshold: taxShipping.freeShippingThreshold || 5000,
          expressShippingCost: taxShipping.expressShippingCost || 1000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
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
      Object.entries(form).forEach(([key, value]) => {
        formData.append(`taxShipping.${key}`, value.toString());
      });

      const res = await fetch("/api/settings", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Tax & shipping settings saved successfully",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tax Settings
          </CardTitle>
          <CardDescription>
            Configure tax rates and calculations for your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.taxRate}
                onChange={handleChange}
                placeholder="e.g. 16"
              />
              <p className="text-sm text-gray-500">
                Enter the tax rate as a percentage (e.g., 16 for 16% VAT)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Settings
          </CardTitle>
          <CardDescription>
            Configure shipping costs and policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultShippingCost">Default Shipping Cost (KSh)</Label>
              <Input
                id="defaultShippingCost"
                name="defaultShippingCost"
                type="number"
                min="0"
                step="0.01"
                value={form.defaultShippingCost}
                onChange={handleChange}
                placeholder="e.g. 500"
              />
              <p className="text-sm text-gray-500">
                Standard shipping cost in Kenyan Shillings
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KSh)</Label>
              <Input
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                type="number"
                min="0"
                step="0.01"
                value={form.freeShippingThreshold}
                onChange={handleChange}
                placeholder="e.g. 5000"
              />
              <p className="text-sm text-gray-500">
                Minimum order value for free shipping
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expressShippingCost">Express Shipping Cost (KSh)</Label>
              <Input
                id="expressShippingCost"
                name="expressShippingCost"
                type="number"
                min="0"
                step="0.01"
                value={form.expressShippingCost}
                onChange={handleChange}
                placeholder="e.g. 1000"
              />
              <p className="text-sm text-gray-500">
                Cost for express/next-day delivery
              </p>
            </div>

            {/* Shipping Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Shipping Preview</h4>
              <div className="space-y-1 text-sm">
                <p>Standard Shipping: KSh {form.defaultShippingCost.toLocaleString()}</p>
                <p>Express Shipping: KSh {form.expressShippingCost.toLocaleString()}</p>
                <p>Free Shipping: Orders over KSh {form.freeShippingThreshold.toLocaleString()}</p>
                <p>Tax Rate: {form.taxRate}%</p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Tax & Shipping Settings
            </Button>
          </form>        </CardContent>
      </Card>
    </div>
  );
}