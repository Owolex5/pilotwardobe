// app/admin/listings/page.tsx
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
  Edit,
  Trash2,
  AlertCircle,
  ChevronLeft,
  Download,
  RefreshCw,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  BarChart3,
  Tag,
  Layers,
  User,
  Calendar
} from 'lucide-react'

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [filteredListings, setFilteredListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
    expired: 0,
    totalValue: 0
  })

  useEffect(() => {
    loadListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [listings, searchQuery, statusFilter, categoryFilter])

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          user:profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setListings(data || [])
      setFilteredListings(data || [])

      // Calculate stats
      const totalValue = data?.reduce((sum, item) => sum + (item.price || 0), 0) || 0
      
      setStats({
        total: data?.length || 0,
        active: data?.filter(l => l.status === 'active').length || 0,
        pending: data?.filter(l => l.status === 'pending').length || 0,
        rejected: data?.filter(l => l.status === 'rejected').length || 0,
        expired: data?.filter(l => l.status === 'expired').length || 0,
        totalValue
      })

    } catch (error) {
      console.error('Error loading listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterListings = () => {
    let filtered = [...listings]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(listing => listing.category === categoryFilter)
    }

    setFilteredListings(filtered)
  }

  const approveListing = async (listingId: string) => {
    try {
      await supabase
        .from('products')
        .update({ 
          status: 'active',
          approved_at: new Date().toISOString()
        })
        .eq('id', listingId)

      // Update local state
      setListings(listings.map(listing => 
        listing.id === listingId ? { 
          ...listing, 
          status: 'active',
          approved_at: new Date().toISOString()
        } : listing
      ))

      // Update stats
      setStats(prev => ({
        ...prev,
        active: prev.active + 1,
        pending: prev.pending - 1
      }))

    } catch (error) {
      console.error('Error approving listing:', error)
    }
  }

  const rejectListing = async (listingId: string, reason: string) => {
    try {
      await supabase
        .from('products')
        .update({ 
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', listingId)

      // Update local state
      setListings(listings.map(listing => 
        listing.id === listingId ? { 
          ...listing, 
          status: 'rejected',
          rejection_reason: reason
        } : listing
      ))

      // Update stats
      setStats(prev => ({
        ...prev,
        rejected: prev.rejected + 1,
        pending: prev.pending - 1
      }))

    } catch (error) {
      console.error('Error rejecting listing:', error)
    }
  }

  const deleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      await supabase
        .from('products')
        .delete()
        .eq('id', listingId)

      const deletedListing = listings.find(l => l.id === listingId)
      
      // Update local state
      setListings(listings.filter(listing => listing.id !== listingId))

      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        [deletedListing?.status || 'active']: prev[deletedListing?.status || 'active'] - 1,
        totalValue: prev.totalValue - (deletedListing?.price || 0)
      }))

    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  const bulkAction = async (action: string) => {
    if (selectedListings.length === 0) return

    if (action === 'approve') {
      for (const listingId of selectedListings) {
        await approveListing(listingId)
      }
    } else if (action === 'reject') {
      for (const listingId of selectedListings) {
        await rejectListing(listingId, 'Bulk rejection by admin')
      }
    } else if (action === 'delete') {
      for (const listingId of selectedListings) {
        await deleteListing(listingId)
      }
    }

    setSelectedListings([])
  }

  const getStatusBadge = (status: string) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
    sold: 'bg-blue-100 text-blue-800'
  }

  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

const getCategories = () => {
  const categories = Array.from(new Set(listings.map(l => l.category).filter(Boolean)))
  return ['all', ...categories]
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
              <h1 className="text-2xl font-bold text-gray-900">Listings Management</h1>
              <p className="text-gray-600">Review, approve, and manage marketplace listings</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadListings}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.total}</p>
            <p className="text-gray-600">Listings</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600">Active</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.active}</p>
            <p className="text-gray-600">Active Listings</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-yellow-600">Review</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.pending}</p>
            <p className="text-gray-600">Pending Review</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-red-600">Rejected</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.rejected}</p>
            <p className="text-gray-600">Rejected</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500">Expired</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.expired}</p>
            <p className="text-gray-600">Expired</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-purple-600">Value</span>
            </div>
            <p className="text-3xl font-bold mb-1">${stats.totalValue.toLocaleString()}</p>
            <p className="text-gray-600">Total Value</p>
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
                    placeholder="Search by title or description..."
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
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                  <option value="sold">Sold</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Categories</option>
                  {getCategories().filter(c => c !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Advanced</span>
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedListings.length > 0 && (
            <div className="p-4 bg-blue-50 border-b">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {selectedListings.length} listing{selectedListings.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => bulkAction('approve')}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={() => bulkAction('reject')}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => bulkAction('delete')}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                  >
                    Delete All
                  </button>
                  <button
                    onClick={() => setSelectedListings([])}
                    className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Listings Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-4 px-6 text-left">
                    <input
                      type="checkbox"
                      checked={selectedListings.length === filteredListings.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedListings(filteredListings.map(l => l.id))
                        } else {
                          setSelectedListings([])
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">Listing</th>
                  <th className="py-4 px-6 text-left font-semibold">User</th>
                  <th className="py-4 px-6 text-left font-semibold">Price</th>
                  <th className="py-4 px-6 text-left font-semibold">Category</th>
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                  <th className="py-4 px-6 text-left font-semibold">Created</th>
                  <th className="py-4 px-6 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No listings found
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((listing) => (
                    <tr key={listing.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedListings([...selectedListings, listing.id])
                            } else {
                              setSelectedListings(selectedListings.filter(id => id !== listing.id))
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {listing.image_url ? (
                            <img
                              src={listing.image_url}
                              alt={listing.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium line-clamp-1">{listing.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{listing.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Eye className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{listing.views || 0} views</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{listing.user?.full_name || 'Unknown'}</span>
                        </div>
                        <p className="text-xs text-gray-500">{listing.user?.email}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold">${listing.price}</div>
                        {listing.original_price && (
                          <div className="text-xs text-gray-500 line-through">
                            ${listing.original_price}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {listing.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(listing.status)}`}>
                          {listing.status}
                        </span>
                        {listing.rejection_reason && (
                          <p className="text-xs text-red-500 mt-1">{listing.rejection_reason}</p>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <Link
                            href={`/listings/${listing.id}`}
                            target="_blank"
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {listing.status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveListing(listing.id)}
                                className="p-2 hover:bg-green-50 text-green-600 rounded-lg"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Rejection reason:')
                                  if (reason) rejectListing(listing.id, reason)
                                }}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteListing(listing.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredListings.length} of {listings.length} listings
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}