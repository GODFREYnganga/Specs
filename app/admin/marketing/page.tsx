"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Plus, BarChart, CreditCard, TrendingUp, Eye, Users, Target, Mail, Share2, MousePointer, DollarSign, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Campaign {
  _id: string
  name: string
  type: string
  status: string
  budget: number
  spent: number
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    revenue: number
    ctr: number
    cpc: number
    roas: number
    cpa: number
  }
  startDate?: string
  endDate?: string
  description?: string
  discountCode?: string
  createdAt: string
}

export default function MarketingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalRevenue: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    activeCampaigns: 0
  })

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    discountCode: "",
    discountType: "",
    discountValue: "",
    targetAudience: {
      ageRange: "",
      gender: "all",
      location: [],
      interests: []
    }
  })

  useEffect(() => {
    fetchCampaigns()
    
    // Set up auto-refresh every 60 seconds if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchCampaigns()
      }, 60000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/marketing')
      const data = await response.json()
      
      if (response.ok) {
        setCampaigns(data.campaigns || [])
        setStats(data.stats || {})
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch campaigns",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget)
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Campaign created successfully"
        })
        setShowCreateDialog(false)
        setFormData({
          name: "",
          type: "",
          description: "",
          budget: "",
          startDate: "",
          endDate: "",
          discountCode: "",
          discountType: "",
          discountValue: "",
          targetAudience: {
            ageRange: "",
            gender: "all",
            location: [],
            interests: []
          }
        })
        fetchCampaigns()
      } else {
        throw new Error('Failed to create campaign')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      })
    }
  }

  const updateCampaignStatus = async (campaignId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/marketing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: campaignId,
          status: newStatus
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Campaign ${newStatus} successfully`
        })
        fetchCampaigns()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "paused": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />
      case "social": return <Share2 className="h-4 w-4" />
      case "ppc": return <MousePointer className="h-4 w-4" />
      default: return <Megaphone className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading marketing campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Megaphone className="h-8 w-8" />
              Marketing Center
            </h1>
            <p className="text-gray-600 mt-1">Manage your marketing campaigns and track performance</p>
          </div>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Marketing Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Marketing</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="ppc">Pay-Per-Click</SelectItem>
                      <SelectItem value="seo">SEO Campaign</SelectItem>
                      <SelectItem value="content">Content Marketing</SelectItem>
                      <SelectItem value="affiliate">Affiliate Marketing</SelectItem>
                      <SelectItem value="display">Display Ads</SelectItem>
                      <SelectItem value="influencer">Influencer Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget">Budget (KSh)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discountCode">Discount Code (Optional)</Label>
                  <Input
                    id="discountCode"
                    value={formData.discountCode}
                    onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                    placeholder="e.g., SUMMER25"
                  />
                </div>
                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="bogo">Buy One Get One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="e.g., 25 or 1000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Campaign</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-blue-600">
                  KSh {stats.totalBudget?.toLocaleString() || 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  KSh {stats.totalSpent?.toLocaleString() || 0}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  KSh {stats.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.activeCampaigns || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Impressions</p>
                <p className="text-xl font-bold">{stats.totalImpressions?.toLocaleString() || 0}</p>
              </div>
              <Eye className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-xl font-bold">{stats.totalClicks?.toLocaleString() || 0}</p>
              </div>
              <MousePointer className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conversions</p>
                <p className="text-xl font-bold">{stats.totalConversions?.toLocaleString() || 0}</p>
              </div>
              <Users className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. ROAS</p>
                <p className="text-xl font-bold">
                  {stats.totalSpent > 0 ? ((stats.totalRevenue / stats.totalSpent) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <BarChart className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Marketing Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first marketing campaign.</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Budget / Spent</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>ROAS</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(campaign.type)}
                        <span className="capitalize">{campaign.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>KSh {campaign.budget.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Spent: KSh {campaign.spent.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{campaign.metrics.impressions.toLocaleString()} impressions</div>
                        <div>{campaign.metrics.clicks.toLocaleString()} clicks</div>
                        <div>{campaign.metrics.conversions} conversions</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${
                        campaign.metrics.roas >= 300 ? "text-green-600" : 
                        campaign.metrics.roas >= 200 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {campaign.metrics.roas.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {campaign.status === "active" ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateCampaignStatus(campaign._id, "paused")}
                          >
                            Pause
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateCampaignStatus(campaign._id, "active")}
                          >
                            Activate
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
