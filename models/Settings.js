const mongoose = require("mongoose")

const SettingsSchema = new mongoose.Schema({
  // General Settings
  general: {
    storeName: {
      type: String,
      default: "Spectacles Store",
      required: true,
    },
    storeLogo: {
      type: String,
      default: "/images/logo.png",
    },
    contactEmail: {
      type: String,
      default: "support@spectacles.com",
      required: true,
    },
    contactPhone: {
      type: String,
      default: "+1 (555) 123-4567",
    },
    storeAddress: {
      type: String,
      default: "123 Main St, City, State 12345",
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "KSh", "NGN"],
    },
    timezone: {
      type: String,
      default: "America/New_York",
    },
  },

  // Tax & Shipping Settings
  taxShipping: {
    taxRate: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 100,
    },
    defaultShippingCost: {
      type: Number,
      default: 9.99,
      min: 0,
    },
    freeShippingThreshold: {
      type: Number,
      default: 100,
      min: 0,
    },
    expressShippingCost: {
      type: Number,
      default: 19.99,
      min: 0,
    },
  },

  // Payment Settings
  payments: {
    stripe: {
      type: Boolean,
      default: false,
    },
    paypal: {
      type: Boolean,
      default: false,
    },
    mpesa: {
      type: Boolean,
      default: false,
    },
    bankTransfer: {
      type: Boolean,
      default: true,
    },
  },

  // Notification Settings
  notifications: {
    emailNotifications: {
      orderConfirmation: {
        type: Boolean,
        default: true,
      },
      orderStatusUpdate: {
        type: Boolean,
        default: true,
      },
      lowStockAlert: {
        type: Boolean,
        default: true,
      },
      customerMessages: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
    },
    smsNotifications: {
      orderConfirmation: {
        type: Boolean,
        default: false,
      },
      orderStatusUpdate: {
        type: Boolean,
        default: false,
      },
      lowStockAlert: {
        type: Boolean,
        default: true,
      },
    },
    webhookUrl: {
      type: String,
      default: "",
    },
    slackWebhook: {
      type: String,
      default: "",
    },
  },

  // Appearance Settings
  appearance: {
    theme: {
      primaryColor: {
        type: String,
        default: "#3b82f6",
      },
      secondaryColor: {
        type: String,
        default: "#64748b",
      },
      accentColor: {
        type: String,
        default: "#f59e0b",
      },
      backgroundColor: {
        type: String,
        default: "#ffffff",
      },
      textColor: {
        type: String,
        default: "#1f2937",
      },
    },
    layout: {
      headerStyle: {
        type: String,
        enum: ["minimal", "standard", "full"],
        default: "standard",
      },
      footerStyle: {
        type: String,
        enum: ["minimal", "standard", "full"],
        default: "standard",
      },
      productGridColumns: {
        type: Number,
        default: 4,
        min: 2,
        max: 5,
      },
      showBreadcrumbs: {
        type: Boolean,
        default: true,
      },
      showSidebar: {
        type: Boolean,
        default: true,
      },
    },
    branding: {
      favicon: {
        type: String,
        default: "",
      },
      bannerImage: {
        type: String,
        default: "",
      },
      footerLogo: {
        type: String,
        default: "",
      },
      customCSS: {
        type: String,
        default: "",
      },
    },
    homepage: {
      heroSection: {
        type: Boolean,
        default: true,
      },
      featuredProducts: {
        type: Boolean,
        default: true,
      },
      testimonials: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: true,
      },
      aboutSection: {
        type: Boolean,
        default: false,
      },
    },
  },

  // SEO Settings
  seo: {
    general: {
      siteTitle: {
        type: String,
        default: "Spectacles Store",
      },
      metaDescription: {
        type: String,
        default: "Premium eyewear and spectacles for every style and need",
      },
      metaKeywords: {
        type: String,
        default: "spectacles, eyewear, glasses, sunglasses, prescription glasses",
      },
      robotsTxt: {
        type: String,
        default: "User-agent: *\nDisallow: /admin/\nDisallow: /api/\nSitemap: /sitemap.xml",
      },
      googleAnalyticsId: {
        type: String,
        default: "",
      },
      googleTagManagerId: {
        type: String,
        default: "",
      },
      facebookPixelId: {
        type: String,
        default: "",
      },
    },
    socialMedia: {
      ogTitle: {
        type: String,
        default: "Spectacles Store - Premium Eyewear",
      },
      ogDescription: {
        type: String,
        default: "Discover our premium collection of eyewear and spectacles",
      },
      ogImage: {
        type: String,
        default: "",
      },
      twitterCard: {
        type: String,
        enum: ["summary", "summary_large_image"],
        default: "summary_large_image",
      },
      twitterSite: {
        type: String,
        default: "",
      },
      twitterCreator: {
        type: String,
        default: "",
      },
    },
    structured: {
      enableSchemaMarkup: {
        type: Boolean,
        default: true,
      },
      organizationName: {
        type: String,
        default: "Spectacles Store",
      },
      organizationType: {
        type: String,
        enum: ["Organization", "LocalBusiness", "Corporation", "EducationalOrganization"],
        default: "LocalBusiness",
      },
      contactPoint: {
        telephone: {
          type: String,
          default: "",
        },
        contactType: {
          type: String,
          default: "customer service",
        },
        areaServed: {
          type: String,
          default: "US",
        },
      },
    },
    sitemap: {
      enableXmlSitemap: {
        type: Boolean,
        default: true,
      },
      includeProducts: {
        type: Boolean,
        default: true,
      },
      includeCategories: {
        type: Boolean,
        default: true,
      },
      includeBlogPosts: {
        type: Boolean,
        default: false,
      },
      changeFrequency: {
        type: String,
        enum: ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"],
        default: "weekly",
      },
    },
  },

  // Advanced Settings
  advanced: {
    performance: {
      enableCaching: {
        type: Boolean,
        default: true,
      },
      cacheExpiration: {
        type: Number,
        default: 3600,
      },
      enableImageOptimization: {
        type: Boolean,
        default: true,
      },
      enableLazyLoading: {
        type: Boolean,
        default: true,
      },
      enableCompression: {
        type: Boolean,
        default: true,
      },
    },
    security: {
      enableSSL: {
        type: Boolean,
        default: true,
      },
      enableCORS: {
        type: Boolean,
        default: false,
      },
      allowedOrigins: {
        type: String,
        default: "*",
      },
      enableRateLimit: {
        type: Boolean,
        default: true,
      },
      rateLimitRequests: {
        type: Number,
        default: 100,
      },
      enableCSP: {
        type: Boolean,
        default: false,
      },
      cspDirectives: {
        type: String,
        default: "default-src 'self'",
      },
    },
    backup: {
      enableAutoBackup: {
        type: Boolean,
        default: false,
      },
      backupFrequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly",
      },
      retentionPeriod: {
        type: Number,
        default: 30,
      },
      backupLocation: {
        type: String,
        enum: ["local", "cloud", "both"],
        default: "local",
      },
    },
    api: {
      enableRestAPI: {
        type: Boolean,
        default: true,
      },
      enableWebhooks: {
        type: Boolean,
        default: false,
      },
      apiRateLimit: {
        type: Number,
        default: 1000,
      },
      enableAPILogging: {
        type: Boolean,
        default: true,
      },
      requireAuthentication: {
        type: Boolean,
        default: true,
      },
    },
    maintenance: {
      maintenanceMode: {
        type: Boolean,
        default: false,
      },
      maintenanceMessage: {
        type: String,
        default: "We are currently performing scheduled maintenance. Please check back soon.",
      },
      allowedIPs: {
        type: String,
        default: "",
      },
      scheduledMaintenance: {
        type: String,
        default: "",
      },
    },
    logging: {
      enableAccessLogs: {
        type: Boolean,
        default: true,
      },
      enableErrorLogs: {
        type: Boolean,
        default: true,
      },
      logLevel: {
        type: String,
        enum: ["debug", "info", "warn", "error"],
        default: "info",
      },
      maxLogSize: {
        type: Number,
        default: 100,
      },
      logRetention: {
        type: Number,
        default: 30,
      },
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

SettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema)
