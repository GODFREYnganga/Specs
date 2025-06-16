"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function GeneralSettingsForm() {
  const [form, setForm] = useState({
    storeName: "",
    storeLogo: null as File | null,
    contactEmail: "",
    contactPhone: "",
    storeAddress: "",
    currency: "KSh",
    timezone: "",
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setForm({
        storeName: data.storeName || "",
        storeLogo: null,
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        storeAddress: data.storeAddress || "",
        currency: data.currency || "KSh",
        timezone: data.timezone || "",
      });
      setLogoPreview(data.storeLogo || "");
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
        if (key === "storeLogo" && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      const res = await fetch("/api/settings", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save settings");
      
      toast({
        title: "Success",
        description: "General settings saved successfully!",
      });
      
      fetchSettings(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, storeLogo: file }));
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium mb-1">Store Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.storeName}
          onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Store Logo</label>
        <input
          type="file"
          accept="image/*"
          className="input input-bordered w-full"
          onChange={e => setForm(f => ({ ...f, logo: e.target.files?.[0] || null }))}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Contact Email</label>
        <input
          type="email"
          className="input input-bordered w-full"
          value={form.contactEmail}
          onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Contact Phone</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.contactPhone}
          onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Store Address</label>
        <textarea
          className="input input-bordered w-full"
          value={form.storeAddress}
          onChange={e => setForm(f => ({ ...f, storeAddress: e.target.value }))}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Currency</label>
        <select
          className="input input-bordered w-full"
          value={form.currency}
          onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="NGN">NGN</option>
          {/* Add more currencies as needed */}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Timezone</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.timezone}
          onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
          placeholder="e.g. America/New_York"
        />
      </div>
      <button type="submit" className="btn btn-primary">Save Settings</button>
    </form>
  );
}
