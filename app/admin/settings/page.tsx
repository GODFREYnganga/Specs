"use client"

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GeneralSettingsForm from "./GeneralSettingsForm";
import TaxShippingSettingsForm from "./TaxShippingSettingsForm";
import PaymentsSettingsForm from "./PaymentsSettingsForm";
import NotificationsSettingsForm from "./NotificationsSettingsForm";
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Store Settings</h1>
          <p className="text-gray-600 mt-1">Configure your store preferences and options</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/admin'}
          className="flex items-center gap-2"
        >
          ← Back to Dashboard
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
