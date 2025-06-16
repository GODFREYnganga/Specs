"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface TaxShippingSettings {
  taxRate: number;
  defaultShippingCost: number;
  freeShippingThreshold: number;
}

export default function TaxShippingSettingsForm() {
  const [form, setForm] = useState<TaxShippingSettings>({
    taxRate: 16,
    defaultShippingCost: 500,
    freeShippingThreshold: 5000,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const settings = await res.json();
        setForm({
          taxRate: settings.taxRate || 16,
          defaultShippingCost: settings.defaultShippingCost || 500,
          freeShippingThreshold: settings.freeShippingThreshold || 5000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value.toString());
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
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
        <p className="text-sm text-gray-500 mt-1">Enter the tax rate as a percentage (e.g., 16 for 16% VAT)</p>
      </div>
      
      <div>
        <Label htmlFor="defaultShippingCost">Default Shipping Cost (KSh)</Label>
        <Input
          id="defaultShippingCost"
          name="defaultShippingCost"
          type="number"
          min="0"
          step="1"
          value={form.defaultShippingCost}
          onChange={handleChange}
          placeholder="e.g. 500"
        />
        <p className="text-sm text-gray-500 mt-1">Standard shipping cost for orders below the free shipping threshold</p>
      </div>
      
      <div>
        <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KSh)</Label>
        <Input
          id="freeShippingThreshold"
          name="freeShippingThreshold"
          type="number"
          min="0"
          step="1"
          value={form.freeShippingThreshold}
          onChange={handleChange}
          placeholder="e.g. 5000"
        />
        <p className="text-sm text-gray-500 mt-1">Minimum order amount for free shipping</p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Tax & Shipping Settings"}
      </Button>
    </form>
  );
}