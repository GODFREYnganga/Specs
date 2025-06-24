"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import {
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye,
  Globe, Smartphone, Monitor, Tablet, Calendar as CalendarIcon,
  Download, RefreshCw, Filter, ArrowUpRight, ArrowDownRight,
  FileText, Mail, Share2, Settings, Clock, Target, BarChart3
} from "lucide-react"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import Link from "next/link"

interface AnalyticsData {
  overview: {
    pageViews: number
    uniqueVisitors: number
    orders: number
    revenue: number
    conversionRate: number
    avgOrderValue: number
    addToCarts: number
    totalEvents: number
  }
  traffic: {
    trafficData: Array<{
      date: string
      pageViews: number
      uniqueVisitors: number
    }>
    sources: Array<{
      source: string
      visitors: number
      pageViews: number
    }>
  }
  sales: Array<{
    date: string
    revenue: number
    orders: number
    customers: number
    avgOrderValue: number
  }>
  topProducts: {
    topViewed: Array<{
      productId: string
      name: string
      views: number
      uniqueViewers: number
    }>
    topSelling: Array<{
      productId: string
      name: string
      sales: number
      revenue: number
    }>
  }
  recentEvents: Array<{
    eventType: string
    timestamp: string
    eventData: any
  }>
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

// Date Range Picker Component
const DateRangePicker = ({ 
  date, 
  setDate 
}: { 
  date: { from: Date; to: Date }
  setDate: (date: { from: Date; to: Date }) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-60 justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDate({ from: range.from, to: range.to })
                setIsOpen(false)
              }
            }}
            numberOfMonths={2}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("daily")
  const [dateRange, setDateRange] = useState({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date())
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        period,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString()
      })
      
      const response = await fetch(`/api/analytics?${params}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
      // Set mock data for demo purposes
      setData({
        overview: {
          pageViews: 12543,
          uniqueVisitors: 8921,
          orders: 156,
          revenue: 2456700,
          conversionRate: 1.24,
          avgOrderValue: 15750,
          addToCarts: 892,
          totalEvents: 34567
        },
        traffic: {
          trafficData: [
            { date: "2024-01-01", pageViews: 1200, uniqueVisitors: 800 },
            { date: "2024-01-02", pageViews: 1400, uniqueVisitors: 950 },
            { date: "2024-01-03", pageViews: 1100, uniqueVisitors: 750 },
            { date: "2024-01-04", pageViews: 1600, uniqueVisitors: 1100 },
            { date: "2024-01-05", pageViews: 1800, uniqueVisitors: 1250 }
          ],
          sources: [
            { source: "Organic", visitors: 4200, pageViews: 6800 },
            { source: "Direct", visitors: 2100, pageViews: 3200 },
            { source: "Social", visitors: 1800, pageViews: 2400 },
            { source: "Paid", visitors: 821, pageViews: 1143 }
          ]
        },
        sales: [
          { date: "2024-01-01", revenue: 45000, orders: 15, customers: 12, avgOrderValue: 3000 },
          { date: "2024-01-02", revenue: 67000, orders: 22, customers: 18, avgOrderValue: 3045 },
          { date: "2024-01-03", revenue: 52000, orders: 18, customers: 15, avgOrderValue: 2889 },
          { date: "2024-01-04", revenue: 78000, orders: 28, customers: 23, avgOrderValue: 2786 },
          { date: "2024-01-05", revenue: 89000, orders: 31, customers: 27, avgOrderValue: 2871 }
        ],
        topProducts: {
          topViewed: [
            { productId: "1", name: "Classic Aviator Sunglasses", views: 2543, uniqueViewers: 1832 },
            { productId: "2", name: "Blue Light Blocking Glasses", views: 1987, uniqueViewers: 1456 },
            { productId: "3", name: "Vintage Round Frames", views: 1654, uniqueViewers: 1123 },
            { productId: "4", name: "Sports Performance Glasses", views: 1432, uniqueViewers: 987 },
            { productId: "5", name: "Designer Cat-Eye Frames", views: 1298, uniqueViewers: 876 }
          ],
          topSelling: [
            { productId: "1", name: "Classic Aviator Sunglasses", sales: 45, revenue: 112500 },
            { productId: "2", name: "Blue Light Blocking Glasses", sales: 38, revenue: 95000 },
            { productId: "3", name: "Vintage Round Frames", sales: 32, revenue: 80000 },
            { productId: "4", name: "Sports Performance Glasses", sales: 28, revenue: 70000 },
            { productId: "5", name: "Designer Cat-Eye Frames", sales: 24, revenue: 60000 }
          ]
        },
        recentEvents: [
          { eventType: "purchase", timestamp: new Date().toISOString(), eventData: {} },
          { eventType: "product_view", timestamp: new Date(Date.now() - 300000).toISOString(), eventData: {} },
          { eventType: "add_to_cart", timestamp: new Date(Date.now() - 600000).toISOString(), eventData: {} }
        ]
      })
    } finally {
      setLoading(false)
    }
  }, [period, dateRange])

  useEffect(() => {
    fetchAnalyticsData()
  }, [period, dateRange])
  
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchAnalyticsData, 60000) // Refresh every minute
      setRefreshInterval(interval)
    } else if (refreshInterval) {
      clearInterval(refreshInterval)
      setRefreshInterval(null)
    }
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [autoRefresh, fetchAnalyticsData, refreshInterval])

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  const exportData = async (format: 'csv' | 'json' | 'pdf') => {
    if (!analyticsData) return
    
    try {
      const exportData = {
        overview: analyticsData.overview,
        dateRange: {
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString()
        },
        period,
        exportedAt: new Date().toISOString()
      }
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${format}-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'csv') {
        // Convert to CSV format
        const csvContent = [
          ['Metric', 'Value'],          ['Page Views', analyticsData.overview.pageViews],
          ['Unique Visitors', analyticsData.overview.uniqueVisitors],
          ['Orders', analyticsData.overview.orders],
          ['Revenue (KSh)', (analyticsData.overview.revenue / 100).toFixed(2)],
          ['Conversion Rate (%)', analyticsData.overview.conversionRate],
          ['Avg Order Value (KSh)', (analyticsData.overview.avgOrderValue / 100).toFixed(2)]
        ].map(row => row.join(',')).join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount / 100)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const MetricCard = ({ 
    title, 
    value, 
    prefix = "", 
    suffix = "", 
    change, 
    icon: Icon,
    trend = "up"
  }: {
    title: string
    value: number | string
    prefix?: string
    suffix?: string
    change?: number
    icon: any
    trend?: "up" | "down" | "neutral"
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">
              {prefix}{typeof value === 'number' ? formatNumber(value) : value}{suffix}
            </p>
            {change !== undefined && (
              <div className="flex items-center space-x-1">
                {trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : trend === "down" ? (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                ) : null}
                <span className={`text-sm font-medium ${
                  trend === "up" ? "text-green-600" : 
                  trend === "down" ? "text-red-600" : 
                  "text-muted-foreground"
                }`}>
                  {change > 0 ? "+" : ""}{change.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">vs last period</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Ensure we always have data to display by using mock data if needed
  const analyticsData = data || {
    overview: {
      pageViews: 12543,
      uniqueVisitors: 8921,
      orders: 156,
      revenue: 2456700,
      conversionRate: 1.24,
      avgOrderValue: 15750,
      addToCarts: 892,
      totalEvents: 34567
    },
    traffic: {
      trafficData: [
        { date: "2024-01-01", pageViews: 1200, uniqueVisitors: 800 },
        { date: "2024-01-02", pageViews: 1400, uniqueVisitors: 950 },
        { date: "2024-01-03", pageViews: 1100, uniqueVisitors: 750 },
        { date: "2024-01-04", pageViews: 1600, uniqueVisitors: 1100 },
        { date: "2024-01-05", pageViews: 1800, uniqueVisitors: 1250 }
      ],
      sources: [
        { source: "Organic", visitors: 4200, pageViews: 6800 },
        { source: "Direct", visitors: 2100, pageViews: 3200 },
        { source: "Social", visitors: 1800, pageViews: 2400 },
        { source: "Paid", visitors: 821, pageViews: 1143 }
      ]
    },
    sales: [
      { date: "2024-01-01", revenue: 45000, orders: 15, customers: 12, avgOrderValue: 3000 },
      { date: "2024-01-02", revenue: 67000, orders: 22, customers: 18, avgOrderValue: 3045 },
      { date: "2024-01-03", revenue: 52000, orders: 18, customers: 15, avgOrderValue: 2889 },
      { date: "2024-01-04", revenue: 78000, orders: 28, customers: 23, avgOrderValue: 2786 },
      { date: "2024-01-05", revenue: 89000, orders: 31, customers: 27, avgOrderValue: 2871 }
    ],
    topProducts: {
      topViewed: [
        { productId: "1", name: "Classic Aviator Sunglasses", views: 2543, uniqueViewers: 1832 },
        { productId: "2", name: "Blue Light Blocking Glasses", views: 1987, uniqueViewers: 1456 },
        { productId: "3", name: "Vintage Round Frames", views: 1654, uniqueViewers: 1123 },
        { productId: "4", name: "Sports Performance Glasses", views: 1432, uniqueViewers: 987 },
        { productId: "5", name: "Designer Cat-Eye Frames", views: 1298, uniqueViewers: 876 }
      ],
      topSelling: [
        { productId: "1", name: "Classic Aviator Sunglasses", sales: 45, revenue: 112500 },
        { productId: "2", name: "Blue Light Blocking Glasses", sales: 38, revenue: 95000 },
        { productId: "3", name: "Vintage Round Frames", sales: 32, revenue: 80000 },
        { productId: "4", name: "Sports Performance Glasses", sales: 28, revenue: 70000 },
        { productId: "5", name: "Designer Cat-Eye Frames", sales: 24, revenue: 60000 }
      ]
    },
    recentEvents: [
      { eventType: "purchase", timestamp: new Date().toISOString(), eventData: {} },
      { eventType: "product_view", timestamp: new Date(Date.now() - 300000).toISOString(), eventData: {} },
      { eventType: "add_to_cart", timestamp: new Date(Date.now() - 600000).toISOString(), eventData: {} }
    ]
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-full p-4 space-y-4 overflow-auto">
        <Link href="/admin" className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Back to Dashboard</Link>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your store's performance and customer behavior
            </p>
          </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <DateRangePicker 
            date={dateRange} 
            setDate={setDateRange}
          />
          
          <Button 
            variant={autoRefresh ? "default" : "outline"} 
            onClick={toggleAutoRefresh}
            size="sm"
          >
            <Clock className="h-4 w-4 mr-2" />
            {autoRefresh ? "Auto On" : "Auto Off"}
          </Button>
          
          <Button variant="outline" onClick={fetchAnalyticsData}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => exportData('csv')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => exportData('json')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">        <MetricCard
          title="Page Views"
          value={analyticsData.overview.pageViews}
          icon={Eye}
          change={12.5}
          trend="up"
        />
        <MetricCard
          title="Unique Visitors"
          value={analyticsData.overview.uniqueVisitors}
          icon={Users}
          change={8.2}
          trend="up"
        />
        <MetricCard
          title="Orders"
          value={analyticsData.overview.orders}
          icon={ShoppingCart}
          change={-2.1}
          trend="down"
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(analyticsData.overview.revenue)}
          icon={DollarSign}
          change={15.3}
          trend="up"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">        <MetricCard
          title="Conversion Rate"
          value={analyticsData.overview.conversionRate}
          suffix="%"
          icon={TrendingUp}
          change={3.2}
          trend="up"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(analyticsData.overview.avgOrderValue)}
          icon={DollarSign}
          change={-1.5}
          trend="down"
        />
        <MetricCard
          title="Cart Additions"
          value={analyticsData.overview.addToCarts}
          icon={ShoppingCart}
          change={5.7}
          trend="up"
        />
        <MetricCard
          title="Total Events"
          value={analyticsData.overview.totalEvents}
          icon={Globe}
          change={18.9}
          trend="up"
        />
      </div>      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Traffic Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
                <CardDescription>Page views and unique visitors over time</CardDescription>
              </CardHeader>
              <CardContent>                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={analyticsData.traffic.trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="pageViews" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="uniqueVisitors" 
                      stackId="2" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Revenue and orders over time</CardDescription>
              </CardHeader>              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analyticsData.sales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.traffic.sources}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                      label={({source, percent}) => `${source} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.traffic.sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Visitor device preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4" />
                    <span>Desktop</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">65%</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/5 h-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Mobile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">30%</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tablet className="h-4 w-4" />
                    <span>Tablet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">5%</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/12 h-full bg-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Detailed sales performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analyticsData.sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value as number) : value,
                      name
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone"
                    dataKey="orders"
                    stroke="#ff7300"
                    fill="#ff7300"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Viewed Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Viewed Products</CardTitle>
                <CardDescription>Most popular products by views</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.topProducts.topViewed.map(product => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={`/api/images/${product.productId}`} alt={product.name} className="w-10 h-10 rounded-md" />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.views} views
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        {product.uniqueViewers} unique viewers
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Selling Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Highest revenue products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.topProducts.topSelling.map(product => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={`/api/images/${product.productId}`} alt={product.name} className="w-10 h-10 rounded-md" />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.sales} sales
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
              <CardDescription>Key takeaways and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Good job! Your revenue has increased by 15% compared to the last period.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    +15%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Heads up! Your order conversion rate has decreased by 2%.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    -2%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-muted-foreground">
                      You've gained 300 new users this month. Keep it up!
                    </p>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    +300
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
