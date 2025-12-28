// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  DollarSign,
  Package,
  Truck,
  RefreshCw,
  Download,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  CreditCard,
  MoreVertical,
  FileText,
  Printer
} from 'lucide-react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  })

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter, paymentFilter])

 const loadOrders = async () => {
  try {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        buyer:profiles!buyer_id(full_name, email, phone),
        seller:profiles!seller_id(full_name, email),
        product:products(title, price, image_url),
        payments(status, flutterwave_tx_ref, amount) 
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase Error:', error.message)
      throw error
    }

    // Since 'payments' comes back as an array [ {status: '...'} ]
    // we map it to 'payment' (singular) for easier use in your UI
    const safeData = (data || []).map(order => ({
      ...order,
      payment: order.payments?.[0] || null // Get the first payment record
    }))

    setOrders(safeData)
    setFilteredOrders(safeData)

    // Stats calculation
    const totalRevenue = safeData.reduce((sum, order) => {
      // Use payment table amount if available, otherwise fallback to order amount
      const amt = order.payment?.amount || order.total_amount || 0
      return order.status === 'delivered' ? sum + Number(amt) : sum
    }, 0)

    setStats({
      total: safeData.length,
      pending: safeData.filter(o => o.status === 'pending').length,
      processing: safeData.filter(o => o.status === 'processing').length,
      shipped: safeData.filter(o => o.status === 'shipped').length,
      delivered: safeData.filter(o => o.status === 'delivered').length,
      cancelled: safeData.filter(o => o.status === 'cancelled').length,
      totalRevenue,
      avgOrderValue: safeData.length > 0 ? totalRevenue / safeData.length : 0
    })

  } catch (error: any) {
    console.error('Error loading orders:', error.message)
  } finally {
    setLoading(false)
  }
}
  const filterOrders = () => {
    let filtered = [...orders]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.buyer?.full_name?.toLowerCase().includes(query) ||
        order.buyer?.email?.toLowerCase().includes(query) ||
        order.product?.title?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment?.status === paymentFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ))

      // Update stats
      const oldStatus = orders.find(o => o.id === orderId)?.status
      if (oldStatus && oldStatus !== status) {
        setStats(prev => ({
          ...prev,
          [oldStatus]: prev[oldStatus] - 1,
          [status]: prev[status] + 1
        }))
      }

    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }

    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600">Process, track, and manage all marketplace orders</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadOrders}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.total}</p>
            <p className="text-gray-600">Orders</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600">Revenue</span>
            </div>
            <p className="text-3xl font-bold mb-1">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-gray-600">Total Revenue</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-yellow-600">Pending</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.pending}</p>
            <p className="text-gray-600">Pending Orders</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-purple-600">Average</span>
            </div>
            <p className="text-3xl font-bold mb-1">${stats.avgOrderValue.toFixed(2)}</p>
            <p className="text-gray-600">Avg Order Value</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { status: 'pending', count: stats.pending, color: 'bg-yellow-500' },
            { status: 'processing', count: stats.processing, color: 'bg-blue-500' },
            { status: 'shipped', count: stats.shipped, color: 'bg-purple-500' },
            { status: 'delivered', count: stats.delivered, color: 'bg-green-500' },
            { status: 'cancelled', count: stats.cancelled, color: 'bg-red-500' }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <div>
                  <p className="text-sm font-medium capitalize">{item.status}</p>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
              </div>
            </div>
          ))}
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
                    placeholder="Search by order ID, customer name, or email..."
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
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Payment Pending</option>
                  <option value="completed">Payment Completed</option>
                  <option value="failed">Payment Failed</option>
                  <option value="refunded">Refunded</option>
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

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-4 px-6 text-left font-semibold">Order ID</th>
                  <th className="py-4 px-6 text-left font-semibold">Customer</th>
                  <th className="py-4 px-6 text-left font-semibold">Product</th>
                  <th className="py-4 px-6 text-left font-semibold">Amount</th>
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                  <th className="py-4 px-6 text-left font-semibold">Payment</th>
                  <th className="py-4 px-6 text-left font-semibold">Date</th>
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
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-mono font-medium text-sm">
                          #{order.id.slice(0, 8)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.payment?.method || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{order.buyer?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{order.buyer?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {order.product?.image_url ? (
                            <img
                              src={order.product.image_url}
                              alt={order.product.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div className="max-w-[200px]">
                            <p className="font-medium text-sm line-clamp-1">{order.product?.title}</p>
                            <p className="text-xs text-gray-500">Qty: {order.quantity || 1}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold">${order.total_amount || order.product?.price || 0}</div>
                        {order.shipping_cost && (
                          <div className="text-xs text-gray-500">
                            Shipping: ${order.shipping_cost}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.payment?.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.payment?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.payment?.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.payment?.status || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {/* Status update dropdown */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden">
                              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => updateOrderStatus(order.id, status)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm capitalize"
                                >
                                  Mark as {status}
                                </button>
                              ))}
                            </div>
                          </div>
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
                Showing {filteredOrders.length} of {orders.length} orders
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