'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/types/database.types'

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

// Use the generated types
type Product = Database['public']['Tables']['products']['Row'] & {
  user_id?: string; // For backward compatibility
}

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  email?: string;
}

type Order = Database['public']['Tables']['orders']['Row'] & {
  product?: Product;
  seller?: Profile;
  buyer?: Profile;
}

type Payment = Database['public']['Tables']['payments']['Row'] & {
  user_id?: string;
  status?: 'pending' | 'completed' | 'failed';
}

type Request = Database['public']['Tables']['item_requests']['Row'] & {
  user_id?: string;
}

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Activity {
  type: string;
  icon: any;
  color: string;
  title: string;
  description: string;
  time: string;
  status: string;
  action: () => void;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [listings, setListings] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [requests, setRequests] = useState<Request[]>([])
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
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Define handleSignOut BEFORE the JSX that uses it
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

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
    
    if (!profileError && profile) {
      setUserProfile(profile)
    }

    // 1. Load user's products
    const { data: userProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false })

    if (productsError) {
      console.error('Products error:', productsError)
    } else {
      setListings(userProducts || [])
    }

    // 2. Load orders (simplified to avoid complex joins)
    const { data: userOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    // Initialize ordersWithDetails as empty array
    let ordersWithDetails: Order[] = []
    
    if (ordersError) {
      console.error('Orders error:', ordersError)
    } else if (userOrders && userOrders.length > 0) {
      // Get unique product IDs - FIXED: Use Array.from instead of spread operator
      const productIds = Array.from(new Set(userOrders
        .map(order => order.product_id)
        .filter((id): id is string => !!id)
      ))
      
      // Load products
      let products: Product[] = []
      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
        products = productsData || []
      }
      
      // Create a map for quick lookup
      const productMap = new Map()
      products?.forEach(product => {
        productMap.set(product.id, product)
      })
      
      // Create enriched order objects
      ordersWithDetails = userOrders.map(order => ({
        ...order,
        product: order.product_id ? productMap.get(order.product_id) || undefined : undefined
      }))
    }
    
    setOrders(ordersWithDetails)

    // 3. Payments - get order IDs from ordersWithDetails
  // 3. Payments - get order IDs from ordersWithDetails
    const orderIds = ordersWithDetails.map(o => o.id).filter(Boolean)
    if (orderIds.length > 0) {
      const { data: userPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .in('order_id', orderIds)
        .order('created_at', { ascending: false })

      if (paymentsError) {
        console.error('Payments error:', paymentsError)
      } else {
        // Convert the database payments to your Payment type
        const convertedPayments: Payment[] = (userPayments || []).map(payment => ({
          ...payment,
          // Cast the status to your custom type if it matches
          status: (payment.status as 'pending' | 'completed' | 'failed') || 'pending'
        }))
        setPayments(convertedPayments)
      }
    } else {
      setPayments([])
    }

    // 4. Item requests
    let userRequests: Request[] = []
    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from('item_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!requestsError) {
        userRequests = requestsData || []
      }
    } catch (err) {
      console.log('item_requests table not ready yet')
    }
    setRequests(userRequests)
// 5. Messages - Get recent messages from user's threads
let userMessages: Message[] = []
try {
  // First, get threads where user is a participant
  const { data: userThreads, error: threadsError } = await supabase
    .from('chat_thread_participants')
    .select('thread_id')
    .eq('user_id', userId)

  if (!threadsError && userThreads && userThreads.length > 0) {
    const threadIds = userThreads.map(t => t.thread_id).filter(Boolean)
    
    // Get recent messages from these threads
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('id, sender_id, thread_id, content, created_at, read_by')
      .in('thread_id', threadIds)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!messagesError && messagesData) {
      // Transform the messages
      userMessages = messagesData.map(msg => {
        const readByArray = msg.read_by || []
        const isRead = readByArray.includes(userId)
        
        return {
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: '', // For now, we'll leave this empty
          content: msg.content,
          read: isRead,
          created_at: msg.created_at || new Date().toISOString()
        }
      })
      setMessages(userMessages)
    }
  }
} catch (err) {
  console.log('messages error:', err)
}

    // Calculate stats
    const activeListings = (userProducts || []).filter(p => p.status === 'active').length
    const completedOrders = ordersWithDetails.filter(o => o.status === 'completed').length
    const pendingOrders = ordersWithDetails.filter(o => o.status === 'pending').length
    const totalEarnings = (payments || [])
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0)
    const totalRequests = userRequests.length
    const activeRequests = userRequests.filter(r => r.status === 'active' || r.status === 'pending').length

    // Get unread messages count from chat threads
    let unreadCount = 0
    try {
      // Get threads where user is a participant
      const { data: threads } = await supabase
        .from('chat_thread_participants')
        .select('thread_id')
        .eq('user_id', userId)

      if (threads && threads.length > 0) {
        const threadIds = threads
          .map(t => t.thread_id)
          .filter((id): id is string => !!id) // Type guard to ensure strings
        
        // Get unread messages in these threads
        const { count, error } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .in('thread_id', threadIds)
          .not('read_by', 'cs', `{${userId}}`)

        if (!error && count) unreadCount = count
      }
    } catch (err) {
      console.log('unread count error:', err)
    }

    setStats({
      activeListings,
      totalEarnings,
      unreadMessages: unreadCount,
      profileViews: profile?.views || 0,
      pendingOrders,
      completedOrders,
      totalRequests,
      activeRequests
    })

    // Build recent activity from real data
    const activityData: Activity[] = [
      // Recent orders
      ...(ordersWithDetails.slice(0, 3).map((order: any) => ({
        type: 'order',
        icon: ShoppingCart,
        color: 'bg-blue-100 text-blue-600',
        title: order.buyer_id === userId ? 'Purchase Made' : 'Sale Made',
        description: order.product?.title || 'Item',
        time: new Date(order.created_at).toLocaleDateString(),
        status: order.status || 'pending',
        action: () => router.push(`/dashboard/orders/${order.id}`)
      }))),
      
      // Recent listings
      ...((userProducts || []).slice(0, 2).map((listing: any) => ({
        type: 'listing',
        icon: Package,
        color: 'bg-green-100 text-green-600',
        title: 'Listing Created',
        description: listing.title,
        time: new Date(listing.created_at).toLocaleDateString(),
        status: listing.status || 'draft',
        action: () => router.push(`/listings/${listing.id}`)
      })) || []),
      
      // Recent requests
      ...(userRequests.slice(0, 2).map((request: Request) => ({
        type: 'request',
        icon: Target,
        color: 'bg-purple-100 text-purple-600',
        title: 'Item Request ' + (request.status === 'matched' ? 'Matched' : 'Submitted'),
        description: request.title,
        time: new Date(request.created_at || '').toLocaleDateString(),
        status: request.status || 'pending',
        action: () => router.push(`/dashboard/requests/${request.id}`)
      })))
    ]

    setRecentActivity(activityData)

  } catch (error) {
    console.error('Error loading user data:', error)
  }
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
        setStats(prev => ({
          ...prev,
          activeListings: Math.max(0, prev.activeListings - 1)
        }))
      } catch (error) {
        console.error('Error deleting listing:', error)
      }
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updateData: Database['public']['Tables']['orders']['Update'] = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }
      
      await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      setOrders(orders.map(order => 
        order.id === orderId ? { 
          ...order, 
          ...updateData
        } : order
      ))
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const calculateCardStats = (): StatCard[] => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentListings = listings.filter(l => new Date(l.created_at) > oneWeekAgo).length
    
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentPayments = payments.filter(p => new Date(p.created_at) > oneMonthAgo)
    const recentEarnings = recentPayments.reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0)

    const recentViews = 0

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

  const filteredListings = listings.filter(listing => 
    searchQuery === '' || 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders = orders.filter(order => 
    activeTab === 'orders' ? true : order.status === (activeTab === 'pending' ? 'pending' : 'completed')
  )

  return (
    <>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div className="flex h-screen bg-gray-50">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
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

                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
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
                                    {listing.images && listing.images.length > 0 ? (
                                      <img
                                        src={Array.isArray(listing.images) ? listing.images[0] : listing.images}
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
                                    {order.product?.images && order.product.images.length > 0 ? (
                                      <img
                                        src={Array.isArray(order.product.images) ? order.product.images[0] : order.product.images}
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
                              {activeTab as string === 'pending'
                                ? 'No pending orders at the moment'
                                : activeTab as string === 'completed'
                                ? 'No completed orders yet'
                                : 'You haven\'t made or received any orders'}
                            </p>
                            {/* Show "View All Orders" button only when we're in a filtered view */}
                            {(activeTab as string === 'pending' || activeTab as string === 'completed') && (
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
                                      {new Date(request.created_at || '').toLocaleDateString()}
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

              <div className="space-y-6">
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