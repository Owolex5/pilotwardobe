// components/admin/AnalyticsDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    userGrowth: [],
    revenueTrend: [],
    categoryDistribution: [],
    listingStatus: [],
    topProducts: []
  })
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      // User growth data
      const { data: userGrowth } = await supabase
        .rpc('get_user_growth', { days: timeRange === '7d' ? 7 : 30 })

      // Revenue trend
      const { data: revenueTrend } = await supabase
        .rpc('get_revenue_trend', { days: timeRange === '7d' ? 7 : 30 })

      // Category distribution
      const { data: categoryData } = await supabase
        .from('products')
        .select('category, count')
        .group('category')

      // Listing status
      const { data: statusData } = await supabase
        .from('products')
        .select('status, count')
        .group('status')

      setAnalytics({
        userGrowth: userGrowth || [],
        revenueTrend: revenueTrend || [],
        categoryDistribution: categoryData?.map(c => ({ name: c.category, value: c.count })) || [],
        listingStatus: statusData?.map(s => ({ name: s.status, value: s.count })) || [],
        topProducts: []
      })

    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 ${timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 ${timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="new_users" stroke="#0088FE" />
              <Line type="monotone" dataKey="total_users" stroke="#00C49F" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884D8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Listing Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Listing Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.listingStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold">3.2%</p>
          <p className="text-green-600 text-sm">↑ 0.5% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-600">Avg. Order Value</p>
          <p className="text-2xl font-bold">$245</p>
          <p className="text-green-600 text-sm">↑ $12 from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-600">Customer Retention</p>
          <p className="text-2xl font-bold">42%</p>
          <p className="text-red-600 text-sm">↓ 3% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-600">Active Sessions</p>
          <p className="text-2xl font-bold">1.2K</p>
          <p className="text-green-600 text-sm">↑ 200 from yesterday</p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard