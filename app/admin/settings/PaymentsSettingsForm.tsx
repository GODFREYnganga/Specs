"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface PaymentSettings {
  paymentMethods: {
    stripe: boolean;
    paypal: boolean;
    mpesa: boolean;
    bankTransfer: boolean;
  };
}

export default function PaymentsSettingsForm() {
  const [form, setForm] = useState<PaymentSettings>({
    paymentMethods: {
      stripe: false,
      paypal: false,
      mpesa: true,
      bankTransfer: true,
    },
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
        if (settings.paymentMethods) {
          setForm({
            paymentMethods: {
              stripe: settings.paymentMethods.stripe || false,
              paypal: settings.paymentMethods.paypal || false,
              mpesa: settings.paymentMethods.mpesa || true,
              bankTransfer: settings.paymentMethods.bankTransfer || true,
            },
          });
        }
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
      
      // Add payment method settings
      Object.entries(form.paymentMethods).forEach(([method, enabled]) => {
        formData.append(`paymentMethods.${method}`, enabled.toString());
      });

      const res = await fetch("/api/settings", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Payment settings saved successfully",
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

  const handlePaymentMethodToggle = (method: keyof PaymentSettings['paymentMethods']) => {
    setForm(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Methods</h3>
        <p className="text-sm text-gray-500">Enable or disable payment methods for your store</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="stripe" className="text-base">Stripe</Label>
              <p className="text-sm text-gray-500">Accept credit and debit cards</p>
            </div>
            <Switch
              id="stripe"
              checked={form.paymentMethods.stripe}
              onCheckedChange={() => handlePaymentMethodToggle('stripe')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="paypal" className="text-base">PayPal</Label>
              <p className="text-sm text-gray-500">Accept PayPal payments</p>
            </div>
            <Switch
              id="paypal"
              checked={form.paymentMethods.paypal}
              onCheckedChange={() => handlePaymentMethodToggle('paypal')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mpesa" className="text-base">M-Pesa</Label>
              <p className="text-sm text-gray-500">Accept M-Pesa mobile payments</p>
            </div>
            <Switch
              id="mpesa"
              checked={form.paymentMethods.mpesa}
              onCheckedChange={() => handlePaymentMethodToggle('mpesa')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="bankTransfer" className="text-base">Bank Transfer</Label>
              <p className="text-sm text-gray-500">Accept bank transfers</p>
            </div>
            <Switch
              id="bankTransfer"
              checked={form.paymentMethods.bankTransfer}
              onCheckedChange={() => handlePaymentMethodToggle('bankTransfer')}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Payment Settings"}
      </Button>
    </form>
  );
}