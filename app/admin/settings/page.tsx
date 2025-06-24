"use client"

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GeneralSettingsForm from "./GeneralSettingsForm";
import TaxShippingSettingsForm from "./TaxShippingSettingsForm";
import PaymentsSettingsForm from "./PaymentsSettingsForm";
import NotificationsSettingsForm from "./NotificationsSettingsForm_NEW";
import AppearanceSettingsForm from "./AppearanceSettingsForm";
import SEOSettingsForm from "./SEOSettingsForm";
import AdvancedSettingsForm from "./AdvancedSettingsForm";

const TABS = [
  { label: "General", value: "general" },
  { label: "Tax & Shipping", value: "tax-shipping" },
  { label: "Payments", value: "payments" },
  { label: "Notifications", value: "notifications" },
  { label: "Appearance", value: "appearance" },
  { label: "SEO", value: "seo" },
  { label: "Advanced", value: "advanced" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-full p-4 space-y-4 overflow-auto">        <Link href="/admin" className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Back to Dashboard</Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Store Settings</h1>
            <p className="text-gray-600 mt-1">Configure your store preferences and options</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        
        <TabsContent value="general">
          <GeneralSettingsForm />
        </TabsContent>
        <TabsContent value="tax-shipping">
          <TaxShippingSettingsForm />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsSettingsForm />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsSettingsForm />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettingsForm />
        </TabsContent>
        <TabsContent value="seo">
          <SEOSettingsForm />
        </TabsContent>
        <TabsContent value="advanced">
          <AdvancedSettingsForm />
        </TabsContent>        </Tabs>
      </div>
    </div>
  );
}
