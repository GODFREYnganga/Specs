"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Smartphone, Building, Banknote } from "lucide-react";

interface PaymentSettings {
  stripe: boolean;
  paypal: boolean;
  mpesa: boolean;
  bankTransfer: boolean;
}

export default function PaymentsSettingsForm() {
  const [form, setForm] = useState<PaymentSettings>({
    stripe: false,
    paypal: false,
    mpesa: true,
    bankTransfer: true,
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
        if (settings.payments) {
          setForm({
            stripe: settings.payments.stripe || false,
            paypal: settings.payments.paypal || false,
            mpesa: settings.payments.mpesa || true,
            bankTransfer: settings.payments.bankTransfer || true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast({
        title: "Error",
        description: "Failed to load payment settings",
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
      
      // Add payment method settings with proper nested structure
      Object.entries(form).forEach(([method, enabled]) => {
        formData.append(`payments.${method}`, enabled.toString());
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

  const handlePaymentMethodToggle = (method: keyof PaymentSettings) => {
    setForm(prev => ({
      ...prev,
      [method]: !prev[method],
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
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Configure which payment methods are available for customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stripe */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <div>
                <Label className="text-base font-medium">Stripe</Label>
                <p className="text-sm text-gray-500">
                  Accept credit and debit cards securely
                </p>
              </div>
            </div>
            <Switch
              checked={form.stripe}
              onCheckedChange={() => handlePaymentMethodToggle('stripe')}
            />
          </div>

          {/* PayPal */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PP</span>
              </div>
              <div>
                <Label className="text-base font-medium">PayPal</Label>
                <p className="text-sm text-gray-500">
                  Let customers pay with PayPal
                </p>
              </div>
            </div>
            <Switch
              checked={form.paypal}
              onCheckedChange={() => handlePaymentMethodToggle('paypal')}
            />
          </div>

          {/* M-Pesa */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-green-600" />
              <div>
                <Label className="text-base font-medium">M-Pesa</Label>
                <p className="text-sm text-gray-500">
                  Mobile money payments (Kenya)
                </p>
              </div>
            </div>
            <Switch
              checked={form.mpesa}
              onCheckedChange={() => handlePaymentMethodToggle('mpesa')}
            />
          </div>

          {/* Bank Transfer */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Building className="h-6 w-6 text-gray-600" />
              <div>
                <Label className="text-base font-medium">Bank Transfer</Label>
                <p className="text-sm text-gray-500">
                  Direct bank transfers and wire payments
                </p>
              </div>
            </div>
            <Switch
              checked={form.bankTransfer}
              onCheckedChange={() => handlePaymentMethodToggle('bankTransfer')}
            />
          </div>

          {/* Payment Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Active Payment Methods
            </h4>
            <div className="space-y-1 text-sm">
              {Object.entries(form).filter(([, enabled]) => enabled).length === 0 ? (
                <p className="text-red-600">⚠️ No payment methods enabled</p>
              ) : (
                Object.entries(form)
                  .filter(([, enabled]) => enabled)
                  .map(([method]) => (
                    <p key={method} className="text-green-600">
                      ✓ {method.charAt(0).toUpperCase() + method.slice(1)}
                    </p>
                  ))
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Payment Settings
          </Button>
        </form>      </CardContent>
    </Card>
  );
}