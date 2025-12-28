 // app/admin/dashboard/page.tsx - RESPONSIVE VERSION
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  // Icons
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Search,
  Bell,
  Home,
  FileText,
  CreditCard,
  Truck,
  Archive,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  Tag,
  Layers,
  PieChart,
  Activity,
  Database,
  Server,
  Globe,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  UserCheck,
  UserX,
  Star,
  Award,
  Target,
  Zap,
  Lock,
  Unlock,
  EyeOff,
  MailCheck,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Menu,
  X,
  LogOut
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  
  // Data states
  const [users, setUsers] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    pendingRequests: 0,
    pendingReviews: 0,
    reports: 0
  })
  
  // Filter states
  const [userFilter, setUserFilter] = useState('all')
  const [listingFilter, setListingFilter] = useState('all')
  const [orderFilter, setOrderFilter] = useState('all')
  const [dateRange, setDateRange] = useState('today')

  useEffect(() => {
    checkAdminAccess()
    loadDashboardData()
    
    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
    
    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/signin')
        return
      }

      // Check if user is admin (check profile or metadata)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setUser(user)
      setIsAdmin(true)
      setLoading(false)
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/dashboard')
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load all users
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers(allUsers || [])

      // Load all listings
      const { data: allListings } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      setListings(allListings || [])

      // Load all orders
      const { data: allOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      setOrders(allOrders || [])

      // Load all payments
      const { data: allPayments } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
      setPayments(allPayments || [])

      // Load item requests
      const { data: allRequests } = await supabase
        .from('item_requests')
        .select('*')
        .order('created_at', { ascending: false })
      setRequests(allRequests || [])

      // Calculate stats
      const activeUsers = allUsers?.filter(u => u.last_sign_in_at > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0
      const activeListings = allListings?.filter(l => l.status === 'active').length || 0
      const pendingListings = allListings?.filter(l => l.status === 'pending').length || 0
      const pendingOrders = allOrders?.filter(o => o.status === 'pending').length || 0
      const completedOrders = allOrders?.filter(o => o.status === 'completed').length || 0
      const revenue = allPayments
        ?.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      const pendingRequests = allRequests?.filter(r => r.status === 'pending').length || 0

      setStats({
        totalUsers: allUsers?.length || 0,
        activeUsers,
        totalListings: allListings?.length || 0,
        activeListings,
        pendingListings,
        totalOrders: allOrders?.length || 0,
        pendingOrders,
        completedOrders,
        revenue,
        pendingRequests,
        pendingReviews: 0, // Add reviews table later
        reports: 0 // Add reports table later
      })

    } catch (error) {
      console.error('Error loading admin data:', error)
    }
  }

  const adminActions = {
    approveListing: async (listingId: string) => {
      try {
        await supabase
          .from('products')
          .update({ status: 'active' })
          .eq('id', listingId)
        
        setListings(listings.map(l => 
          l.id === listingId ? { ...l, status: 'active' } : l
        ))
        
        setStats(prev => ({
          ...prev,
          activeListings: prev.activeListings + 1,
          pendingListings: prev.pendingListings - 1
        }))
      } catch (error) {
        console.error('Error approving listing:', error)
      }
    },

    rejectListing: async (listingId: string, reason: string) => {
      try {
        await supabase
          .from('products')
          .update({ 
            status: 'rejected',
            rejection_reason: reason
          })
          .eq('id', listingId)
        
        setListings(listings.map(l => 
          l.id === listingId ? { ...l, status: 'rejected', rejection_reason: reason } : l
        ))
        
        setStats(prev => ({
          ...prev,
          pendingListings: prev.pendingListings - 1
        }))
      } catch (error) {
        console.error('Error rejecting listing:', error)
      }
    },

    suspendUser: async (userId: string, reason: string) => {
      try {
        await supabase
          .from('profiles')
          .update({ 
            status: 'suspended',
            suspension_reason: reason,
            suspended_at: new Date().toISOString()
          })
          .eq('id', userId)
        
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: 'suspended', suspension_reason: reason } : u
        ))
        
        // Also update auth metadata if needed
        await supabase.auth.admin.updateUserById(
          userId,
          { user_metadata: { suspended: true } }
        )
      } catch (error) {
        console.error('Error suspending user:', error)
      }
    },

    approveRequest: async (requestId: string) => {
      try {
        await supabase
          .from('item_requests')
          .update({ status: 'approved' })
          .eq('id', requestId)
        
        setRequests(requests.map(r => 
          r.id === requestId ? { ...r, status: 'approved' } : r
        ))
      } catch (error) {
        console.error('Error approving request:', error)
      }
    },

    markOrderComplete: async (orderId: string) => {
      try {
        await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('id', orderId)
        
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, status: 'completed' } : o
        ))
      } catch (error) {
        console.error('Error marking order complete:', error)
      }
    }
  }

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(!mobileSidebarOpen)
    } else {
      setSidebarOpen(!sidebarOpen)
    }
  }

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading Admin Dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Checking permissions</p>
        </div>
      </div>
    )
  }

  const adminMenuItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'users', label: 'Users', icon: Users, badge: stats.totalUsers },
    { id: 'listings', label: 'Listings', icon: Package, badge: stats.pendingListings },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: stats.pendingOrders },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: null },
    { id: 'requests', label: 'Item Requests', icon: Target, badge: stats.pendingRequests },
    { id: 'reports', label: 'Reports', icon: FileText, badge: stats.reports },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'moderation', label: 'Moderation', icon: Shield, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ]

  const adminStats = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Pending Listings',
      value: stats.pendingListings,
      change: stats.pendingListings > 0 ? `${stats.pendingListings} need review` : 'All clear',
      trend: stats.pendingListings > 0 ? 'neutral' : 'up',
      icon: Package,
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Order Completion',
      value: `${stats.completedOrders}/${stats.totalOrders}`,
      change: stats.totalOrders > 0 ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}% rate` : 'No orders',
      trend: stats.completedOrders > 0 ? 'up' : 'neutral',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      change: stats.activeListings > 0 ? `${stats.activeListings} active` : 'No listings',
      trend: stats.activeListings > 0 ? 'up' : 'neutral',
      icon: Layers,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      change: stats.pendingRequests > 0 ? `${stats.pendingRequests} pending` : 'All clear',
      trend: stats.pendingRequests > 0 ? 'neutral' : 'up',
      icon: Target,
      color: 'from-rose-500 to-pink-600'
    }
  ]

  const recentActivities = [
    ...listings.slice(0, 3).filter(l => l.status === 'pending').map(listing => ({
      type: 'listing',
      title: 'New Listing Pending Review',
      description: listing.title,
      user: listing.user_id,
      time: 'Just now',
      priority: 'high',
      action: () => router.push(`/admin/listings/${listing.id}`)
    })),
    ...orders.slice(0, 2).filter(o => o.status === 'pending').map(order => ({
      type: 'order',
      title: 'New Order Requires Processing',
      description: `Order #${order.id.slice(0, 8)}`,
      user: order.buyer_id,
      time: '10 mins ago',
      priority: 'medium',
      action: () => router.push(`/admin/orders/${order.id}`)
    })),
    ...requests.slice(0, 2).filter(r => r.status === 'pending').map(request => ({
      type: 'request',
      title: 'Item Request Pending',
      description: request.title,
      user: request.user_id,
      time: '1 hour ago',
      priority: request.urgency === 'urgent' ? 'high' : 'medium',
      action: () => router.push(`/admin/requests/${request.id}`)
    }))
  ]

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={closeMobileSidebar}
        />
      )}

      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 z-30`}>
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              {sidebarOpen && (
                <div>
                  <h2 className="font-bold text-lg">Admin Controls</h2>
                  <p className="text-sm text-gray-500">Full system access</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-2 md:p-4 overflow-y-auto">
            <ul className="space-y-1 md:space-y-2">
              {adminMenuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/${item.id}`}
                    onClick={closeMobileSidebar}
                    className="flex items-center justify-between px-3 md:px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge !== null && item.badge > 0 && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 md:mt-8">
              {sidebarOpen && (
                <h3 className="px-3 md:px-4 text-sm font-semibold text-gray-500 mb-2">Quick Actions</h3>
              )}
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <UserPlus className="w-5 h-5" />
                  {sidebarOpen && <span>Add New User</span>}
                </button>
                <button 
                  onClick={loadDashboardData}
                  className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                >
                  <RefreshCw className="w-5 h-5" />
                  {sidebarOpen && <span>Refresh Data</span>}
                </button>
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut()
                    router.push('/signin')
                  }}
                  className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                >
                  <LogOut className="w-5 h-5" />
                  {sidebarOpen && <span>Logout Admin</span>}
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="font-bold text-lg">Admin Controls</h2>
                <p className="text-sm text-gray-500">Full system access</p>
              </div>
            </div>
            <button onClick={closeMobileSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {adminMenuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/${item.id}`}
                    onClick={closeMobileSidebar}
                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="px-4 text-sm font-semibold text-gray-500 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <UserPlus className="w-5 h-5" />
                  <span>Add New User</span>
                </button>
                <button 
                  onClick={() => {
                    loadDashboardData()
                    closeMobileSidebar()
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Refresh Data</span>
                </button>
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut()
                    router.push('/signin')
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout Admin</span>
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                <button 
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 hidden md:block">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Admin<span className="text-blue-600">Dashboard</span>
                </h1>
              </div>
              <div className="flex items-center space-x-3 md:space-x-6">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users, orders, listings..."
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-64"
                  />
                </div>
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium text-sm">{user?.email}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Search */}
            <div className="mt-3 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, orders, listings..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </nav>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
              {adminStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border p-4 md:p-5">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className={`flex items-center text-xs md:text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' :
                      stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />}
                      {stat.trend === 'down' && <TrendingDown className="w-3 h-3 md:w-4 md:h-4 mr-1" />}
                      <span className="hidden md:inline">{stat.change}</span>
                      <span className="md:hidden text-xs">{stat.value}</span>
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl font-bold mb-1">{window.innerWidth < 768 ? stat.title : stat.value}</p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {window.innerWidth < 768 ? stat.change : stat.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Activity Feed */}
                <div className="bg-white rounded-xl shadow-sm border">
                  <div className="p-4 md:p-6 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Activity</h2>
                      <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm w-full md:w-auto"
                      >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    {recentActivities.length > 0 ? (
                      <div className="space-y-3 md:space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                            onClick={activity.action}
                          >
                            <div className="flex items-center space-x-3 md:space-x-4 mb-2 md:mb-0">
                              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                                <activity.icon className="w-4 h-4 md:w-5 md:h-5" />
                              </div>
                              <div>
                                <p className="font-medium text-sm md:text-base">{activity.title}</p>
                                <p className="text-xs md:text-sm text-gray-500">{activity.description}</p>
                              </div>
                            </div>
                            <div className="flex justify-between md:flex-col md:text-right">
                              <p className="text-xs text-gray-500">{activity.time}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                activity.priority === 'high' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {activity.priority} priority
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 md:py-8">
                        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                        <p className="text-gray-500">All caught up! No pending activities.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Users Management */}
                <div className="bg-white rounded-xl shadow-sm border">
                  <div className="p-4 md:p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Users</h2>
                      <Link href="/admin/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All →
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] md:min-w-0">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 text-left text-sm font-semibold text-gray-900">User</th>
                            <th className="py-3 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Role</th>
                            <th className="py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="py-3 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">Joined</th>
                            <th className="py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.slice(0, 5).map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 md:py-4">
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                  <div>
                                    <p className="font-medium text-sm md:text-base">{user.full_name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 md:py-4 hidden md:table-cell">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role || 'user'}
                                </span>
                              </td>
                              <td className="py-3 md:py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                                  user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.status || 'active'}
                                </span>
                              </td>
                              <td className="py-3 md:py-4 text-gray-500 text-sm hidden lg:table-cell">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-3 md:py-4">
                                <div className="flex space-x-1 md:space-x-2">
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-4 md:space-y-6">
                {/* Pending Actions */}
                <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                  <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Pending Actions</h3>
                  <div className="space-y-3 md:space-y-4">
                    {listings.filter(l => l.status === 'pending').slice(0, 3).map((listing) => (
                      <div key={listing.id} className="p-3 md:p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2 md:mb-3">
                          <span className="font-medium text-sm md:text-base">Listing Review</span>
                          <span className="text-xs md:text-sm text-gray-500">New</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 truncate">{listing.title}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => adminActions.approveListing(listing.id)}
                            className="flex-1 py-1.5 md:py-2 bg-green-600 text-white rounded-lg text-xs md:text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => adminActions.rejectListing(listing.id, 'Manual review required')}
                            className="flex-1 py-1.5 md:py-2 border border-red-600 text-red-600 rounded-lg text-xs md:text-sm hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                    {listings.filter(l => l.status === 'pending').length === 0 && (
                      <div className="text-center py-4">
                        <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No pending listings</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="font-bold text-base md:text-lg">System Health</h3>
                    <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs md:text-sm font-medium">
                      Healthy
                    </span>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs md:text-sm">Database</span>
                        <span className="text-xs md:text-sm font-medium">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                        <div className="bg-green-600 h-1.5 md:h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs md:text-sm">API Response</span>
                        <span className="text-xs md:text-sm font-medium">98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                        <div className="bg-green-500 h-1.5 md:h-2 rounded-full w-[98%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs md:text-sm">Storage</span>
                        <span className="text-xs md:text-sm font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                        <div className="bg-amber-500 h-1.5 md:h-2 rounded-full w-[67%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 md:p-6 text-white">
                  <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                    <Activity className="w-5 h-5 md:w-6 md:h-6" />
                    <h3 className="font-bold text-base md:text-lg">Performance</h3>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm">Page Load Time</span>
                      <span className="font-bold text-sm md:text-base">1.2s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm">Active Sessions</span>
                      <span className="font-bold text-sm md:text-base">142</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm">Error Rate</span>
                      <span className="font-bold text-sm md:text-base">0.12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm">Uptime</span>
                      <span className="font-bold text-sm md:text-base">99.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}