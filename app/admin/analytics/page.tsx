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
    if (!data) return
    
    try {
      const exportData = {
        overview: data.overview,
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
          ['Metric', 'Value'],
          ['Page Views', data.overview.pageViews],
          ['Unique Visitors', data.overview.uniqueVisitors],
          ['Orders', data.overview.orders],
          ['Revenue (KSh)', (data.overview.revenue / 100).toFixed(2)],
          ['Conversion Rate (%)', data.overview.conversionRate],
          ['Avg Order Value (KSh)', (data.overview.avgOrderValue / 100).toFixed(2)]
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

  if (!data) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">No analytics data available</p>
          <Button onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-full p-4 space-y-4 overflow-auto">{/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>          <p className="text-muted-foreground">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Page Views"
          value={data.overview.pageViews}
          icon={Eye}
          change={12.5}
          trend="up"
        />
        <MetricCard
          title="Unique Visitors"
          value={data.overview.uniqueVisitors}
          icon={Users}
          change={8.2}
          trend="up"
        />
        <MetricCard
          title="Orders"
          value={data.overview.orders}
          icon={ShoppingCart}
          change={-2.1}
          trend="down"
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(data.overview.revenue)}
          icon={DollarSign}
          change={15.3}
          trend="up"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Conversion Rate"
          value={data.overview.conversionRate}
          suffix="%"
          icon={TrendingUp}
          change={3.2}
          trend="up"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(data.overview.avgOrderValue)}
          icon={DollarSign}
          change={-1.5}
          trend="down"
        />
        <MetricCard
          title="Cart Additions"
          value={data.overview.addToCarts}
          icon={ShoppingCart}
          change={5.7}
          trend="up"
        />
        <MetricCard
          title="Total Events"
          value={data.overview.totalEvents}
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
                  <AreaChart data={data.traffic.trafficData}>
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
                  <LineChart data={data.sales}>
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
                      data={data.traffic.sources}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                      label={({source, percent}) => `${source} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.traffic.sources.map((entry, index) => (
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
                <AreaChart data={data.sales}>
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
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Viewed Products */}
            <Card>
              <CardHeader>
                <CardTitle>Most Viewed Products</CardTitle>
                <CardDescription>Products with highest view counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProducts.topViewed.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(product.uniqueViewers)} unique viewers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumber(product.views)}</p>
                        <p className="text-sm text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Selling Products */}
            <Card>
              <CardHeader>
                <CardTitle>Best Selling Products</CardTitle>
                <CardDescription>Products with highest sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProducts.topSelling.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(product.revenue)} revenue
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumber(product.sales)}</p>
                        <p className="text-sm text-muted-foreground">sales</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>        </TabsContent>        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Peak Traffic:</strong> Most visitors come between 2-4 PM on weekdays.
                    Consider scheduling promotions during this time.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Growth Opportunity:</strong> Mobile conversion rate is 2.1% lower than desktop.
                    Optimize mobile checkout experience.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Customer Behavior:</strong> Users who view 3+ products are 5x more likely to purchase.
                    Improve product recommendations.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
                <CardDescription>Overall store performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-3/5 h-full bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Good</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Traffic Quality</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-full bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Retention</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-2/5 h-full bg-orange-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Needs Work</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Revenue Growth</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Very Good</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">B+</div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>            {/* Recommendations */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions to improve your store performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">Optimize Mobile Experience</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        30% of your traffic is mobile, but conversion is 40% lower. 
                        Consider implementing one-click checkout and mobile-specific promotions.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Mobile Analytics
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900">Increase Average Order Value</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Add product bundles and upsell recommendations. 
                        Current AOV is KSh 157.50, target should be KSh 200+.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Create Bundles
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Mail className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-900">Reduce Cart Abandonment</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        68% of carts are abandoned. Set up email reminders and exit-intent popups 
                        to recover lost sales.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Setup Email Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events and user interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentEvents.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center space-x-4 p-2 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium capitalize">
                    {event.eventType.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <Badge variant="secondary">
                  {event.eventType}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}