// app/admin/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  Download,
  RefreshCw,
  ChevronLeft,
  Activity,
  Target,
  Award,
  Globe,
  Clock,
  Eye,
  Heart,
  Share2,
  Filter,
  ChevronRight
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalListings: 0,
      conversionRate: 0,
      avgOrderValue: 0
    },
    revenueData: [] as { date: string; revenue: number }[],
    userGrowth: [] as { date: string; count: number }[],
    topProducts: [] as any[],
    trafficSources: [] as { source: string; count: number; percentage: number }[],
    categoryStats: [] as { category: string; count: number; revenue: number }[]
  })

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      // Get current date and calculate date range
      const endDate = new Date()
      let startDate = new Date()
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(startDate.getDate() - 90)
          break
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
      }

      // Load orders data
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      // Load users data
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      // Load listings data
      const { data: listings } = await supabase
        .from('products')
        .select('*')

      // Load payments data
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      // Calculate overview stats
      const completedOrders = orders?.filter(o => o.status === 'delivered') || []
      const totalRevenue = payments
        ?.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      
      const avgOrderValue = completedOrders.length > 0 
        ? totalRevenue / completedOrders.length 
        : 0

      // Calculate conversion rate (simplified)
      const totalVisitors = users?.length || 0
      const conversionRate = totalVisitors > 0 
        ? (completedOrders.length / totalVisitors) * 100 
        : 0

      // Generate sample revenue data (in a real app, this would come from the database)
      const revenueData = generateRevenueData(startDate, endDate, totalRevenue)
      
      // Generate user growth data
      const userGrowth = generateGrowthData(startDate, endDate, users || [])

      // Get top products
      const topProducts = await getTopProducts()

      // Get category stats
      const categoryStats = getCategoryStats(listings || [])

      // Get traffic sources (simplified)
      const trafficSources = [
        { source: 'Direct', count: 450, percentage: 40 },
        { source: 'Organic Search', count: 300, percentage: 27 },
        { source: 'Social Media', count: 200, percentage: 18 },
        { source: 'Referral', count: 150, percentage: 15 }
      ]

      setAnalytics({
        overview: {
          totalRevenue,
          totalOrders: orders?.length || 0,
          totalUsers: users?.length || 0,
          totalListings: listings?.length || 0,
          conversionRate,
          avgOrderValue
        },
        revenueData,
        userGrowth,
        topProducts,
        trafficSources,
        categoryStats
      })

    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateRevenueData = (startDate: Date, endDate: Date, totalRevenue: number) => {
    const data = []
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      // Generate random revenue for each day (for demo)
      const revenue = Math.floor(Math.random() * (totalRevenue / daysDiff) * 0.5)
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue
      })
    }
    
    return data
  }

  const generateGrowthData = (startDate: Date, endDate: Date, users: any[]) => {
    const data = []
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    let cumulativeCount = 0
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      // Count users created on this day
      const dayUsers = users.filter(user => 
        new Date(user.created_at).toDateString() === date.toDateString()
      ).length
      
      cumulativeCount += dayUsers
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: cumulativeCount
      })
    }
    
    return data
  }

  const getTopProducts = async () => {
    try {
      // Get products with their order counts
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('views', { ascending: false })
        .limit(5)

      return products || []
    } catch (error) {
      console.error('Error getting top products:', error)
      return []
    }
  }

  const getCategoryStats = (listings: any[]) => {
    const categories: Record<string, { count: number; revenue: number }> = {}
    
    listings.forEach(listing => {
      if (!categories[listing.category || 'Uncategorized']) {
        categories[listing.category || 'Uncategorized'] = { count: 0, revenue: 0 }
      }
      categories[listing.category || 'Uncategorized'].count++
      categories[listing.category || 'Uncategorized'].revenue += listing.price || 0
    })
    
    return Object.entries(categories).map(([category, stats]) => ({
      category,
      ...stats
    })).sort((a, b) => b.revenue - a.revenue)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Insights and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <main className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                12.5%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{formatCurrency(analytics.overview.totalRevenue)}</p>
            <p className="text-gray-600">Total Revenue</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-blue-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                8.2%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{analytics.overview.totalOrders}</p>
            <p className="text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-purple-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                15.3%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{analytics.overview.totalUsers}</p>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-amber-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                5.7%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{analytics.overview.totalListings}</p>
            <p className="text-gray-600">Total Listings</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-emerald-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                3.2%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{analytics.overview.conversionRate.toFixed(1)}%</p>
            <p className="text-gray-600">Conversion Rate</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-rose-600 flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                2.1%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{formatCurrency(analytics.overview.avgOrderValue)}</p>
            <p className="text-gray-600">Avg Order Value</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Revenue Over Time</h3>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600">Growing</span>
              </div>
            </div>
            <div className="h-64 flex items-end space-x-1">
              {analytics.revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                    style={{ height: `${(item.revenue / 5000) * 100}%` }}
                    title={`${formatCurrency(item.revenue)} on ${item.date}`}
                  />
                  <span className="text-xs text-gray-500 mt-2">{item.date}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Total revenue for selected period: {formatCurrency(analytics.overview.totalRevenue)}
              </p>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-purple-600">+{analytics.userGrowth[analytics.userGrowth.length - 1]?.count || 0}</span>
              </div>
            </div>
            <div className="h-64 relative">
              <div className="absolute inset-0 flex items-end">
                <div className="flex-1 flex space-x-1">
                  {analytics.userGrowth.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg"
                        style={{ height: `${(item.count / 100) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                {analytics.userGrowth.length > 0 && (
                  <>
                    From {analytics.userGrowth[0]?.date} to {analytics.userGrowth[analytics.userGrowth.length - 1]?.date}: 
                    <span className="font-semibold ml-1">
                      +{analytics.userGrowth[analytics.userGrowth.length - 1]?.count || 0} users
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
              <Link href="/admin/listings" className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.title}</p>
                    <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${product.price}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      {product.views || 0} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Traffic Sources</h3>
              <Globe className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.trafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{source.source}</span>
                    <span className="text-sm text-gray-600">{source.count} ({source.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Category Performance</h3>
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{category.category}</p>
                    <p className="text-xs text-gray-500">{category.count} listings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(category.revenue)}</p>
                    <p className="text-xs text-gray-500">
                      Avg: {formatCurrency(category.revenue / category.count)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1.2s</p>
                  <p className="text-sm text-gray-600">Avg Page Load</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-gray-600">User Satisfaction</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">45%</p>
                  <p className="text-sm text-gray-600">Return Rate</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-sm text-gray-600">Goal Completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}