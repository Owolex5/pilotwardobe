// app/dashboard/page.tsx - ENHANCED VERSION (Real Data Only) - FIXED
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import {
  Home,
  Package,
  ShoppingCart,
  MessageSquare,
  User,
  LogOut,
  PlusCircle,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Eye,
  Heart,
  Star,
  Shield,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronDown,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Package2,
  Users,
  BarChart,
  Download,
  Upload,
  HelpCircle,
  Calendar,
  Tag,
  Layers,
  RefreshCw,
  EyeOff,
  Zap,
  Target,
  AlertTriangle,
  CheckSquare,
  FilePlus,
  Clipboard,
  ShoppingBag,
  Wallet,
  TrendingDown
} from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([]) // Item requests
  const [stats, setStats] = useState({
    activeListings: 0,
    totalEarnings: 0,
    unreadMessages: 0,
    profileViews: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRequests: 0,
    activeRequests: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
      } else {
        setUser(user)
        await loadUserData(user.id)
        setLoading(false)
      }
    }
    checkUser()

    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [router])

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (!profileError) {
        setUserProfile(profile)
      }

      // Load user's products (listings)
      const { data: userProducts, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (!productsError) {
        setListings(userProducts || [])
      }

      // Load user's orders (both as buyer and seller)
      const { data: userOrders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(*),
          seller:profiles!orders_seller_id_fkey(*),
          buyer:profiles!orders_buyer_id_fkey(*)
        `)
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false })
      
      if (!ordersError) {
        setOrders(userOrders || [])
      }

      // Load user's payments
      const { data: userPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (!paymentsError) {
        setPayments(userPayments || [])
      }

      // Load item requests - handle if table doesn't exist
      let userRequests = []
      try {
        const { data: requestsData, error: requestsError } = await supabase
          .from('item_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        if (!requestsError) {
          userRequests = requestsData || []
          setRequests(userRequests)
        }
      } catch (error) {
        console.log('Item requests table might not exist yet')
        setRequests([])
      }

      // Load messages (if messages table exists)
      let userMessages = []
      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .eq('read', false)
          .order('created_at', { ascending: false })
        
        if (!messagesError) {
          userMessages = messagesData || []
          setMessages(userMessages)
        }
      } catch (error) {
        console.log('Messages table might not exist yet')
        setMessages([])
      }

      // Calculate stats
      const activeListings = userProducts?.filter(p => p.status === 'active').length || 0
      const completedOrders = userOrders?.filter(o => o.status === 'completed').length || 0
      const pendingOrders = userOrders?.filter(o => o.status === 'pending').length || 0
      const totalEarnings = userPayments
        ?.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      const totalRequests = userRequests.length || 0
      const activeRequests = userRequests.filter(r => r.status === 'active' || r.status === 'pending').length || 0

      setStats({
        activeListings,
        totalEarnings,
        unreadMessages: userMessages.length || 0,
        profileViews: profile?.views || 0,
        pendingOrders,
        completedOrders,
        totalRequests,
        activeRequests
      })

      // Build recent activity from real data
      const activityData = [
        // Recent orders
        ...(userOrders?.slice(0, 3).map(order => ({
          type: 'order',
          icon: ShoppingCart,
          color: 'bg-blue-100 text-blue-600',
          title: order.type === 'buy' ? 'Purchase Made' : 'Sale Made',
          description: order.product?.title || 'Item',
          time: new Date(order.created_at).toLocaleDateString(),
          status: order.status,
          action: () => router.push(`/dashboard/orders/${order.id}`)
        })) || []),
        
        // Recent listings views
        ...(userProducts?.slice(0, 2).filter(l => l.view_count > 0).map(listing => ({
          type: 'listing',
          icon: Package,
          color: 'bg-green-100 text-green-600',
          title: 'Listing Viewed',
          description: `${listing.title} - ${listing.view_count || 0} views`,
          time: 'Recently',
          status: 'viewed',
          action: () => router.push(`/listings/${listing.id}`)
        })) || []),
        
        // Recent requests
        ...(userRequests?.slice(0, 2).map(request => ({
          type: 'request',
          icon: Target,
          color: 'bg-purple-100 text-purple-600',
          title: 'Item Request ' + (request.status === 'matched' ? 'Matched' : 'Submitted'),
          description: request.title,
          time: new Date(request.created_at).toLocaleDateString(),
          status: request.status,
          action: () => router.push(`/dashboard/requests/${request.id}`)
        })) || [])
      ]

      setRecentActivity(activityData)

    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(!mobileSidebarOpen)
    } else {
      setSidebarOpen(!sidebarOpen)
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await supabase.from('products').delete().eq('id', listingId)
        setListings(listings.filter(l => l.id !== listingId))
        // Update stats
        setStats(prev => ({
          ...prev,
          activeListings: prev.activeListings - 1
        }))
      } catch (error) {
        console.error('Error deleting listing:', error)
      }
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  // Calculate dynamic stats for cards
  const calculateCardStats = () => {
    // Calculate listing trends
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentListings = listings.filter(l => new Date(l.created_at) > oneWeekAgo).length
    
    // Calculate payment trends
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentPayments = payments.filter(p => new Date(p.created_at) > oneMonthAgo)
    const recentEarnings = recentPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

    // Calculate profile view trends
    const recentViews = 0 // You'll need to implement view tracking

    return [
      { 
        label: 'Active Listings', 
        value: stats.activeListings, 
        icon: Package, 
        color: 'from-blue-500 to-blue-600',
        change: recentListings > 0 ? `+${recentListings} this week` : 'No new listings',
        trend: recentListings > 0 ? 'up' : 'neutral'
      },
      { 
        label: 'Total Earnings', 
        value: `$${stats.totalEarnings.toLocaleString()}`, 
        icon: DollarSign, 
        color: 'from-green-500 to-emerald-600',
        change: recentEarnings > 0 ? `+$${recentEarnings} this month` : 'No earnings this month',
        trend: recentEarnings > 0 ? 'up' : 'neutral'
      },
      { 
        label: 'Pending Orders', 
        value: stats.pendingOrders, 
        icon: Clock, 
        color: 'from-amber-500 to-orange-600',
        change: stats.pendingOrders > 0 ? `${stats.pendingOrders} need attention` : 'All clear',
        trend: stats.pendingOrders > 0 ? 'neutral' : 'up'
      },
      { 
        label: 'Active Requests', 
        value: stats.activeRequests, 
        icon: Target, 
        color: 'from-purple-500 to-purple-600',
        change: stats.activeRequests > 0 ? `${stats.activeRequests} active` : 'No active requests',
        trend: stats.activeRequests > 0 ? 'up' : 'neutral'
      },
      { 
        label: 'Completed Sales', 
        value: stats.completedOrders, 
        icon: CheckCircle, 
        color: 'from-emerald-500 to-teal-600',
        change: stats.completedOrders > 0 ? `${stats.completedOrders} total sales` : 'No sales yet',
        trend: stats.completedOrders > 0 ? 'up' : 'neutral'
      },
      { 
        label: 'Profile Views', 
        value: stats.profileViews, 
        icon: Eye, 
        color: 'from-rose-500 to-pink-600',
        change: recentViews > 0 ? `+${recentViews} recently` : 'No views yet',
        trend: recentViews > 0 ? 'up' : 'neutral'
      },
    ]
  }

  const statsCards = calculateCardStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Preparing your cockpit...</p>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'listings', label: 'My Listings', icon: Package, badge: stats.activeListings },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: stats.pendingOrders },
    { id: 'requests', label: 'Item Requests', icon: Target, badge: stats.activeRequests },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: stats.unreadMessages },
    { id: 'payments', label: 'Payments', icon: Wallet, badge: null },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: null },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ]

  // Filter listings based on search
  const filteredListings = listings.filter(listing => 
    searchQuery === '' || 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => 
    activeTab === 'orders' ? true : order.status === (activeTab === 'pending' ? 'pending' : 'completed')
  )

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col ${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 z-30`}>
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo/logo1.png"
                  alt="PilotWardrobe Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Pilot<span className="text-blue-600">Wardrobe</span>
                </h1>
              )}
            </div>
          </div>

          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{user?.user_metadata?.full_name || user?.email}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">
                      {stats.activeListings > 0 ? `${stats.activeListings} Active Listings` : 'New User'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {sidebarItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id)
                      if (window.innerWidth < 1024) setMobileSidebarOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge !== null && item.badge > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${activeTab === item.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Add New Item Buttons */}
            {sidebarOpen && (
              <div className="mt-8 space-y-3">
                <Link
                  href="/sell"
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-medium">Sell Item</span>
                </Link>
                <Link
                  href="/request-item"
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition"
                >
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Request Item</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="p-4 border-t">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform`}>
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo/logo1.png"
                  alt="PilotWardrobe Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold">PilotWardrobe</h1>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)}><X className="w-6 h-6" /></button>
          </div>
          
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold truncate">{user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-gray-500">
                  {stats.activeListings > 0 ? `${stats.activeListings} Active Listings` : 'New User'}
                </p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {sidebarItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileSidebarOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 space-y-3">
              <Link
                href="/sell"
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <PlusCircle className="w-5 h-5" />
                <span className="font-medium">Sell Item</span>
              </Link>
              <Link
                href="/request-item"
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Target className="w-5 h-5" />
                <span className="font-medium">Request Item</span>
              </Link>
            </div>
          </nav>
          
          <div className="p-4 border-t">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-50 text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b px-6 py-4 sticky top-0 z-20">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Menu className="w-6 h-6 lg:hidden" />
                  <ChevronRight className={`w-5 h-5 hidden lg:block transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search gear, orders, requests..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-gray-100 rounded-xl w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  {stats.unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.email?.[0]?.toUpperCase()}
                  </div>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Pilot'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                {stats.activeListings > 0 
                  ? `You have ${stats.activeListings} active listings and ${stats.pendingOrders} pending orders.`
                  : 'Start by listing your first item to begin selling!'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {statsCards.map((stat, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' :
                        stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border">
                  <div className="border-b">
                    <div className="flex space-x-1 p-4">
                      {['Overview', 'Listings', 'Orders', 'Requests', 'Analytics'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab.toLowerCase())}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            activeTab === tab.toLowerCase()
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {/* Recent Activity */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Recent Activity</h3>
                            <button 
                              onClick={() => loadUserData(user?.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Refresh
                            </button>
                          </div>
                          <div className="space-y-3">
                            {recentActivity.length > 0 ? (
                              recentActivity.map((activity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                                  onClick={activity.action}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                                      <activity.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{activity.title}</p>
                                      <p className="text-sm text-gray-500">{activity.description}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">{activity.time}</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      activity.status === 'matched' ? 'bg-purple-100 text-purple-800' :
                                      activity.status === 'viewed' ? 'bg-blue-100 text-blue-800' :
                                      activity.status === 'active' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {activity.status}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No recent activity</p>
                                <p className="text-sm text-gray-400 mt-1">Start by listing an item or making a purchase!</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-blue-900">Listings Performance</h4>
                              <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-3xl font-bold text-blue-900 mb-2">{stats.activeListings}</p>
                            <p className="text-blue-700 text-sm">
                              {stats.activeListings > 0 
                                ? 'Active listings generating interest'
                                : 'No active listings yet'}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-purple-900">Request Success</h4>
                              <Target className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-3xl font-bold text-purple-900 mb-2">
                              {stats.totalRequests > 0 ? Math.round((stats.completedOrders / stats.totalRequests) * 100) : 0}%
                            </p>
                            <p className="text-purple-700 text-sm">
                              {stats.totalRequests > 0 
                                ? 'Item requests successfully fulfilled'
                                : 'No item requests yet'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'listings' && (
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-semibold">My Listings</h3>
                          <Link
                            href="/sell"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>New Listing</span>
                          </Link>
                        </div>
                        
                        {filteredListings.length > 0 ? (
                          <div className="space-y-4">
                            {filteredListings.map((listing) => (
                              <div key={listing.id} className="border rounded-xl p-4 hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-4">
                                    {listing.image_url ? (
                                      <img
                                        src={listing.image_url}
                                        alt={listing.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                    ) : (
                                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-400" />
                                      </div>
                                    )}
                                    <div>
                                      <h4 className="font-semibold">{listing.title}</h4>
                                      <p className="text-sm text-gray-500">{listing.category}</p>
                                      <div className="flex items-center space-x-4 mt-2">
                                        <span className="font-bold text-lg">${listing.price}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                          listing.status === 'active' ? 'bg-green-100 text-green-800' :
                                          listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                          listing.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {listing.status || 'draft'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Link
                                      href={`/listings/${listing.id}/edit`}
                                      className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                      onClick={() => handleDeleteListing(listing.id)}
                                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold mb-2">
                              {searchQuery ? 'No listings found' : 'No listings yet'}
                            </h4>
                            <p className="text-gray-500 mb-6">
                              {searchQuery 
                                ? 'Try a different search term'
                                : 'Start selling your aviation gear and parts'}
                            </p>
                            <Link
                              href="/sell"
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center space-x-2"
                            >
                              <PlusCircle className="w-5 h-5" />
                              <span>Create Your First Listing</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'orders' && (
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-semibold">Orders & Sales</h3>
                          <div className="flex space-x-2">
                            <select 
                              onChange={(e) => setActiveTab(e.target.value)}
                              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                              <option value="orders">All Orders</option>
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        
                        {filteredOrders.length > 0 ? (
                          <div className="space-y-4">
                            {filteredOrders.map((order) => (
                              <div key={order.id} className="border rounded-xl p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <div className="font-semibold">Order #{order.id.slice(0, 8)}</div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-lg">${order.total_amount || order.product?.price || '0'}</div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                      order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {order.status || 'unknown'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between border-t pt-4">
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
                                    <div>
                                      <p className="font-medium">{order.product?.title || 'Unknown Item'}</p>
                                      <p className="text-sm text-gray-500">
                                        {order.buyer_id === user?.id 
                                          ? `Purchased from ${order.seller?.full_name || 'Seller'}`
                                          : `Sold to ${order.buyer?.full_name || 'Buyer'}`
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                                      className="px-3 py-1 border rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                      Details
                                    </button>
                                    {order.status === 'pending' && order.seller_id === user?.id && (
                                      <button
                                        onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                      >
                                        Process
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold mb-2">No orders yet</h4>
                            <p className="text-gray-500 mb-6">
                              {activeTab === 'pending' 
                                ? 'No pending orders at the moment'
                                : activeTab === 'completed'
                                ? 'No completed orders yet'
                                : 'You haven\'t made or received any orders'}
                            </p>
                            {activeTab !== 'orders' && (
                              <button
                                onClick={() => setActiveTab('orders')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                View All Orders
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'requests' && (
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-semibold">Item Requests</h3>
                          <Link
                            href="/request-item"
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition flex items-center space-x-2"
                          >
                            <Target className="w-4 h-4" />
                            <span>New Request</span>
                          </Link>
                        </div>
                        
                        {requests.length > 0 ? (
                          <div className="space-y-4">
                            {requests.map((request) => (
                              <div key={request.id} className="border rounded-xl p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">{request.title}</h4>
                                    <div className="flex items-center space-x-4 mt-2">
                                      <span className="text-sm text-gray-500">{request.category}</span>
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        request.status === 'matched' ? 'bg-green-100 text-green-800' :
                                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {request.status}
                                      </span>
                                    </div>
                                    {request.budget_min && request.budget_max && (
                                      <p className="text-sm text-gray-500 mt-2">
                                        Budget: ${request.budget_min} - ${request.budget_max}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                    <span className={`px-2 py-1 text-xs rounded-full mt-2 ${
                                      request.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                                      request.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                                      request.urgency === 'medium' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {request.urgency} priority
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold mb-2">Request Items Feature</h4>
                            <p className="text-gray-500 mb-6">
                              Can't find what you're looking for? Request items and get notified when they become available.
                            </p>
                            <Link
                              href="/request-item"
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition inline-flex items-center space-x-2"
                            >
                              <Target className="w-5 h-5" />
                              <span>Request an Item</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/sell"
                      className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition group"
                    >
                      <PlusCircle className="w-8 h-8 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition" />
                      <p className="font-medium">Sell Gear</p>
                    </Link>
                    <Link
                      href="/request-item"
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition group"
                    >
                      <Target className="w-8 h-8 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition" />
                      <p className="font-medium">Request Item</p>
                    </Link>
                    <Link
                      href="/marketplace"
                      className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition group"
                    >
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-green-600 group-hover:scale-110 transition" />
                      <p className="font-medium">Browse</p>
                    </Link>
                    <Link
                      href="/dashboard/payments"
                      className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-center transition group"
                    >
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-amber-600 group-hover:scale-110 transition" />
                      <p className="font-medium">Payments</p>
                    </Link>
                  </div>
                </div>

                {/* Recent Messages */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Recent Messages</h3>
                    <Link href="/messages" className="text-sm text-blue-600 hover:text-blue-700">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      messages.slice(0, 3).map((message) => (
                        <div key={message.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {message.sender_id === user?.id ? 'You' : 'Other User'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{message.content}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No unread messages</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tips & Updates */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6" />
                    <h3 className="font-semibold">Pro Tip</h3>
                  </div>
                  <p className="mb-4">
                    {stats.activeListings > 0
                      ? 'Add detailed photos and accurate descriptions to increase your sales by up to 40%.'
                      : 'Start by listing high-quality photos and detailed descriptions for better sales.'}
                  </p>
                  <Link
                    href={stats.activeListings > 0 ? "/sell" : "/guide"}
                    className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-center"
                  >
                    Learn More
                  </Link>
                </div>

                {/* Support Status */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Account Status</h3>
                    <span className={`text-sm flex items-center ${
                      stats.activeListings > 0 ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {stats.activeListings > 0 ? 'Active Seller' : 'Verified'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {stats.activeListings > 0
                      ? `You have ${stats.activeListings} active listings. Keep it up!`
                      : 'List your first item to become an active seller.'}
                  </p>
                  <Link
                    href="/help"
                    className="block w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-center"
                  >
                    Get Help
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}