// app/admin/swaps/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Users,
  MessageSquare,
  ChevronLeft,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  DollarSign,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Target
} from 'lucide-react'

export default function AdminSwapsPage() {
  const [swaps, setSwaps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadSwaps()
  }, [])

  const loadSwaps = async () => {
    try {
      // This is a placeholder - you'll need to query your actual swaps table
      const { data, error } = await supabase
        .from('swap_proposals')
        .select(`
          *,
          user:profiles(full_name, email),
          items:wardrobe_items(name, category)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSwaps(data || [])
    } catch (error) {
      console.error('Error loading swaps:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      matched: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }

    return statusColors[status] || 'bg-gray-100 text-gray-800'
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
              <h1 className="text-2xl font-bold text-gray-900">Swaps Management</h1>
              <p className="text-gray-600">Monitor and manage wardrobe swap proposals</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadSwaps}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <main className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold mb-1">{swaps.length}</p>
            <p className="text-gray-600">Swap Proposals</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-yellow-600">Pending</span>
            </div>
            <p className="text-3xl font-bold mb-1">
              {swaps.filter(s => s.status === 'pending').length}
            </p>
            <p className="text-gray-600">Awaiting Match</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600">Active</span>
            </div>
            <p className="text-3xl font-bold mb-1">
              {swaps.filter(s => s.status === 'matched' || s.status === 'in_progress').length}
            </p>
            <p className="text-gray-600">Active Swaps</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-emerald-600">Completed</span>
            </div>
            <p className="text-3xl font-bold mb-1">
              {swaps.filter(s => s.status === 'completed').length}
            </p>
            <p className="text-gray-600">Successful</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search swaps by user or item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="matched">Matched</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Advanced</span>
                </button>
              </div>
            </div>
          </div>

          {/* Swaps Table */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto"></div>
              </div>
            ) : swaps.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No swap proposals found</p>
                <p className="text-gray-500 text-sm mt-2">
                  When users submit swap proposals, they will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {swaps.map((swap) => (
                  <div key={swap.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(swap.status)}`}>
                            {swap.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Created: {new Date(swap.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2">{swap.title || 'Untitled Swap'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{swap.user?.full_name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{swap.user?.email}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Items Offered:</h4>
                            <div className="flex flex-wrap gap-1">
                              {swap.items?.map((item: any, index: number) => (
                                <span key={index} className="px-2 py-1 bg-white border rounded text-xs">
                                  {item.name}
                                </span>
                              )) || (
                                <span className="text-xs text-gray-500">No items listed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}