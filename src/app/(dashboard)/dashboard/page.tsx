// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { Camera, Image as ImageIcon, Download, Star, Eye, Filter } from 'lucide-react';

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
  Heart,
  Shield,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronDown,
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

type AviationImage = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  resolution: string;
  tags: string[];
  image_url: string;
  thumbnail_url: string;
  watermark_url: string;
  downloads: number;
  views: number;
  status: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  seller?: Profile;
  avg_rating?: number;
  review_count?: number;
};

type ImageReview = {
  id: string;
  image_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: Profile;
};

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
  const sidebarRef = useRef<HTMLDivElement>(null)

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

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [router])

  useEffect(() => {
    // Prevent body scroll when mobile sidebar is open
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileSidebarOpen])

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
    { id: 'aviation-images', label: 'Aviation Images', icon: Camera, badge: null },
  ]

  const filteredListings = listings.filter(listing => 
    searchQuery === '' || 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Aviation Images Component
  const AviationImagesSection = () => {
    const [aviationImages, setAviationImages] = useState<AviationImage[]>([]);
    const [imageStats, setImageStats] = useState({
      totalImages: 0,
      approvedImages: 0,
      totalEarnings: 0,
      totalDownloads: 0,
      avgRating: 0,
    });
    const [selectedImage, setSelectedImage] = useState<AviationImage | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
      title: '',
      description: '',
      price: 25,
      tags: '',
      resolution: '4K',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
      loadAviationImages();
    }, []);

    const loadAviationImages = async () => {
      try {
        const { data: images, error } = await supabase
          .from('aviation_images')
          .select(`
            *,
            seller:profiles(*)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (!error && images) {
          setAviationImages(images);

          // Calculate stats
          const totalImages = images.length;
          const approvedImages = images.filter(img => img.status === 'approved').length;
          
          // Load earnings from payments
          const { data: payments } = await supabase
            .from('payments')
            .select('amount')
            .eq('user_id', user?.id)
            .eq('status', 'completed')
            .not('image_id', 'is', null);

          const totalEarnings = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

          // Load total downloads
          const { count: totalDownloads } = await supabase
            .from('image_downloads')
            .select('id', { count: 'exact' })
            .eq('user_id', user?.id);

          // Load average rating
          const { data: reviews } = await supabase
            .from('image_reviews')
            .select('rating')
            .in('image_id', images.map(img => img.id));

          const avgRating = reviews && reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0;

          setImageStats({
            totalImages,
            approvedImages,
            totalEarnings,
            totalDownloads: totalDownloads || 0,
            avgRating,
          });
        }
      } catch (error) {
        console.error('Error loading aviation images:', error);
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          alert('Please select a valid image file (JPEG, PNG, or WebP)');
          return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          alert('Image size must be less than 10MB');
          return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    };

    const addWatermarkToImage = async (file: File): Promise<File> => {
      // In a real implementation, you would use Canvas API to add watermark
      // For now, we'll return the original file
      return file;
    };

    const uploadImage = async () => {
      if (!selectedFile || !uploadForm.title || !uploadForm.description) {
        alert('Please fill all required fields and select an image');
        return;
      }

      setUploading(true);
      try {
        // Step 1: Upload original image to Supabase Storage
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
        const filePath = `original/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('aviation-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('aviation-images')
          .getPublicUrl(filePath);

        // Step 2: Create thumbnail (simplified - in production, use server function)
        const thumbnailPath = `thumbnails/${fileName}`;
        const thumbnailUrl = publicUrl; // In production, create actual thumbnail

        // Step 3: Add watermark (simplified - in production, use server function)
        const watermarkedFile = await addWatermarkToImage(selectedFile);
        const watermarkPath = `watermarked/${fileName}`;
        
        const { error: watermarkError } = await supabase.storage
          .from('aviation-images')
          .upload(watermarkPath, watermarkedFile);

        if (watermarkError) throw watermarkError;

        const { data: { publicUrl: watermarkUrl } } = supabase.storage
          .from('aviation-images')
          .getPublicUrl(watermarkPath);

        // Step 4: Save image metadata to database
        const tagsArray = uploadForm.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);

        const { data: imageData, error: dbError } = await supabase
          .from('aviation_images')
          .insert({
            user_id: user?.id,
            title: uploadForm.title,
            description: uploadForm.description,
            price: uploadForm.price,
            resolution: uploadForm.resolution,
            tags: tagsArray,
            image_url: publicUrl,
            thumbnail_url: thumbnailUrl,
            watermark_url: watermarkUrl,
            status: 'pending', // Admin approval required
          })
          .select()
          .single();

        if (dbError) throw dbError;

        // Refresh images list
        loadAviationImages();
        setShowUploadModal(false);
        setSelectedFile(null);
        setPreviewUrl('');
        setUploadForm({
          title: '',
          description: '',
          price: 25,
          tags: '',
          resolution: '4K',
        });

        alert('Image uploaded successfully! It will be reviewed by our team before going live.');
      } catch (error: any) {
        console.error('Upload error:', error);
        alert('Error uploading image: ' + error.message);
      } finally {
        setUploading(false);
      }
    };

    const initiatePurchase = async (image: AviationImage) => {
      try {
        // Create payment record
        const { data: payment, error } = await supabase
          .from('payments')
          .insert({
            user_id: user?.id,
            amount: image.price,
            status: 'pending',
            currency: 'USD',
            image_id: image.id,
            license_type: 'personal',
          })
          .select()
          .single();

        if (error) throw error;

        // Initialize Flutterwave payment
        const flutterwaveConfig = {
          public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
          tx_ref: payment.id,
          amount: image.price,
          currency: 'USD',
          payment_options: 'card, banktransfer, ussd',
          customer: {
            email: user?.email,
            name: user?.user_metadata?.full_name || user?.email,
          },
          customizations: {
            title: 'PilotWardrobe Aviation Images',
            description: `Purchase: ${image.title}`,
            logo: '/images/logo/logo1.png',
          },
          callback: async (response: any) => {
            if (response.status === 'successful') {
              // Update payment status
              await supabase
                .from('payments')
                .update({
                  status: 'completed',
                  transaction_id: response.transaction_id,
                  flutterwave_ref: response.flw_ref,
                })
                .eq('id', payment.id);

              // Record download
              await supabase
                .from('image_downloads')
                .insert({
                  image_id: image.id,
                  user_id: user?.id,
                  payment_id: payment.id,
                  license_type: 'personal',
                });

              // Increment download count
              await supabase
                .from('aviation_images')
                .update({ downloads: image.downloads + 1 })
                .eq('id', image.id);

              alert('Purchase successful! Your image is ready for download.');
              loadAviationImages();
            }
          },
          onclose: () => console.log('Payment closed'),
        };

        // Initialize Flutterwave
        if ((window as any).FlutterwaveCheckout) {
          (window as any).FlutterwaveCheckout(flutterwaveConfig);
        } else {
          // Load Flutterwave script
          const script = document.createElement('script');
          script.src = 'https://checkout.flutterwave.com/v3.js';
          script.async = true;
          script.onload = () => {
            (window as any).FlutterwaveCheckout(flutterwaveConfig);
          };
          document.body.appendChild(script);
        }
      } catch (error) {
        console.error('Purchase error:', error);
        alert('Error initiating purchase');
      }
    };

    return (
      <div className="space-y-6">
        {/* Image Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Total Images</h4>
              <Camera className="w-5 h-5 text-black-600" />
            </div>
            <p className="text-3xl font-bold">{imageStats.totalImages}</p>
            <p className="text-sm text-gray-500">
              {imageStats.approvedImages} approved
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Total Earnings</h4>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">${imageStats.totalEarnings}</p>
            <p className="text-sm text-gray-500">From image sales</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Downloads</h4>
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">{imageStats.totalDownloads}</p>
            <p className="text-sm text-gray-500">Total downloads</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Avg Rating</h4>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold">{imageStats.avgRating.toFixed(1)}</p>
            <p className="text-sm text-gray-500">Customer reviews</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">My Aviation Images</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => loadAviationImages()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-black rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>

        {/* Images Grid */}
        {aviationImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aviationImages.map((image) => (
              <div key={image.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                {/* Image Preview */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {image.thumbnail_url ? (
                    <img
                      src={image.thumbnail_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Watermark Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-xl font-bold text-black/20">
                      PilotWardrobe
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      image.status === 'approved' ? 'bg-green-100 text-green-800' :
                      image.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {image.status}
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    ${image.price}
                  </div>
                </div>

                {/* Image Details */}
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2">{image.title}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {image.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {image.tags?.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{image.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{image.downloads} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{image.avg_rating || 0}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      Preview
                    </button>
                    {image.status === 'approved' && (
                      <button
                        onClick={() => initiatePurchase(image)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-black rounded-lg hover:from-green-700 hover:to-green-800 transition text-sm"
                      >
                        ${image.price}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              No Aviation Images Yet
            </h4>
            <p className="text-gray-600 mb-6">
              Start earning by uploading your flight view photography
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-black rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
            >
              Upload Your First Image
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Aviation Image</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={uploading}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {previewUrl ? (
                        <div className="mb-4">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-48 sm:max-h-64 mx-auto rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                      )}
                      <div className="mb-2">
                        <p className="font-medium text-gray-900">
                          {selectedFile ? selectedFile.name : 'Choose an image file'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedFile 
                            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                            : 'PNG, JPG, WebP up to 10MB'
                          }
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        {selectedFile ? 'Change File' : 'Choose File'}
                      </button>
                    </label>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Image Title *
                      </label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 'Sunset Over Alps'"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Describe the view, location, aircraft, etc..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Price ($) *
                        </label>
                        <select
                          value={uploadForm.price}
                          onChange={(e) => setUploadForm({ ...uploadForm, price: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="10">$10 - Basic</option>
                          <option value="15">$15 - Standard</option>
                          <option value="20">$20 - Premium</option>
                          <option value="25">$25 - Professional</option>
                          <option value="30">$30 - Elite</option>
                          <option value="35">$35 - Exclusive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Resolution *
                        </label>
                        <select
                          value={uploadForm.resolution}
                          onChange={(e) => setUploadForm({ ...uploadForm, resolution: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="4K">4K (3840x2160)</option>
                          <option value="5K">5K (5120x2880)</option>
                          <option value="6K">6K (6144x3456)</option>
                          <option value="8K">8K (7680x4320)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Tags (comma separated) *
                      </label>
                      <input
                        type="text"
                        value={uploadForm.tags}
                        onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., sunset, mountains, cockpit, 737"
                      />
                    </div>

                    {/* Terms */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="image-terms"
                          className="mt-1"
                          required
                        />
                        <label htmlFor="image-terms" className="text-sm text-gray-600">
                          I confirm that I own the rights to this image and agree to PilotWardrobe's terms. 
                          I understand that images will be watermarked and I'll receive 70% of each sale ($7-$24.50 per image).
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        disabled={uploading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={uploadImage}
                        disabled={uploading || !selectedFile}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-black rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          'Upload & Submit for Review'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedImage.title}</h2>
                    <p className="text-gray-600">Uploaded on {new Date(selectedImage.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image Preview */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 sm:p-8 flex items-center justify-center">
                    {selectedImage.watermark_url ? (
                      <img
                        src={selectedImage.watermark_url}
                        alt={selectedImage.title}
                        className="max-w-full max-h-64 sm:max-h-96 rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Watermarked preview</p>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedImage.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-2xl font-bold">${selectedImage.price}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Resolution</p>
                        <p className="text-lg font-semibold">{selectedImage.resolution}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.tags?.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-50 text-black-600 rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Views</p>
                        <p className="text-xl font-semibold">{selectedImage.views}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Downloads</p>
                        <p className="text-xl font-semibold">{selectedImage.downloads}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`text-lg font-semibold ${
                          selectedImage.status === 'approved' ? 'text-green-600' :
                          selectedImage.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedImage.status}
                        </p>
                      </div>
                    </div>

                    {selectedImage.status === 'approved' && (
                      <button
                        onClick={() => initiatePurchase(selectedImage)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-black rounded-lg hover:from-green-700 hover:to-green-800 transition"
                      >
                        Purchase Image - ${selectedImage.price}
                      </button>
                    )}

                    {selectedImage.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-1">Rejection Reason</h4>
                        <p className="text-red-700">{selectedImage.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const filteredOrders = orders.filter(order => 
    activeTab === 'orders' ? true : order.status === (activeTab === 'pending' ? 'pending' : 'completed')
  )

  // Render the correct content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button 
                  onClick={() => loadUserData(user?.id)}
                  className="text-black-600 hover:text-blue-700 text-sm font-medium px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      onClick={activity.action}
                    >
                      <div className="flex items-start sm:items-center space-x-4 mb-3 sm:mb-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                          <activity.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
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
        );
      
      case 'listings':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold">My Listings</h3>
              <Link
                href="/sell"
                className="px-4 py-2 bg-blue-600 text-blue rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Listing</span>
              </Link>
            </div>
            
            {filteredListings.length > 0 ? (
              <div className="space-y-4">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="border rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                  className="px-6 py-3 bg-blue-600 text-blue rounded-lg hover:bg-blue-700 transition inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Your First Listing</span>
                </Link>
              </div>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold">Orders & Sales</h3>
              <div className="flex space-x-2 w-full sm:w-auto">
                <select 
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 w-full sm:w-auto"
                  value={activeTab}
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div>
                        <div className="font-semibold">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
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
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t pt-4 gap-4">
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
                          className="px-3 py-1 border rounded-lg hover:bg-gray-50 text-sm w-full sm:w-auto"
                        >
                          Details
                        </button>
                        {order.status === 'pending' && order.seller_id === user?.id && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                            className="px-3 py-1 bg-blue-600 text-blue rounded-lg hover:bg-blue-700 text-sm w-full sm:w-auto"
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
                    className="px-6 py-3 bg-blue-600 text-blue rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
                  >
                    View All Orders
                  </button>
                )}
              </div>
            )}
          </div>
        );
      
      case 'requests':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold">Item Requests</h3>
              <Link
                href="/request-item"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-blue rounded-lg hover:from-purple-700 hover:to-purple-800 transition flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Target className="w-4 h-4" />
                <span>New Request</span>
              </Link>
            </div>
            
            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
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
                      <div className="text-left sm:text-right">
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
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-blue rounded-lg hover:opacity-90 transition inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Target className="w-5 h-5" />
                  <span>Request an Item</span>
                </Link>
              </div>
            )}
          </div>
        );
      
      case 'aviation-images':
        return <AviationImagesSection />;
      
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Profile Settings</h3>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-blue text-3xl font-bold">
                  {user?.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{user?.user_metadata?.full_name || user?.email}</h4>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Member since {new Date(user?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.user_metadata?.full_name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto">
                  Cancel
                </button>
                <button className="px-6 py-3 bg-blue-600 text-blue rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Account Settings</h3>
            
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h4 className="text-lg font-semibold">Notification Preferences</h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates about your orders and listings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Get real-time alerts on your device</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-500">Receive promotions and newsletters</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h4 className="text-lg font-semibold">Privacy & Security</h4>
              </div>
              <div className="p-6 space-y-4">
                <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium">Connected Devices</p>
                    <p className="text-sm text-gray-500">Manage your logged-in devices</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h4 className="text-lg font-semibold">Account Management</h4>
              </div>
              <div className="p-6 space-y-4">
                <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition text-red-600">
                  <div>
                    <p className="font-medium">Deactivate Account</p>
                    <p className="text-sm">Temporarily disable your account</p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-4 border border-red-600 rounded-lg hover:bg-red-600 transition text-red-600 hover:text-blue"
                >
                  <div>
                    <p className="font-medium">Sign Out</p>
                    <p className="text-sm">Log out from all devices</p>
                  </div>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'payments':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Payments & Earnings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-black">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Total Earnings</h4>
                  <DollarSign className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
                <p className="text-sm opacity-90">All time earnings</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-black">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Available Balance</h4>
                  <Wallet className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold">${(stats.totalEarnings * 0.8).toLocaleString()}</p>
                <p className="text-sm opacity-90">After 20% platform fee</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-black">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Next Payout</h4>
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold">${(stats.totalEarnings * 0.2).toLocaleString()}</p>
                <p className="text-sm opacity-90">On 15th of next month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h4 className="text-lg font-semibold">Recent Transactions</h4>
              </div>
              <div className="p-6">
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2">
                        <div>
                          <p className="font-medium">Payment #{payment.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-lg">${payment.amount}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No payment history yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'messages':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Messages</h3>
            
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h4 className="text-lg font-semibold">Conversations</h4>
              </div>
              <div className="p-6">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-black font-bold mr-4">
                          {message.sender_id === user?.id ? 'Y' : 'O'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">
                              {message.sender_id === user?.id ? 'You' : 'Other User'}
                            </p>
                            <span className="text-sm text-gray-400">
                              {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p className="text-gray-600 truncate">{message.content}</p>
                        </div>
                        {!message.read && message.sender_id !== user?.id && (
                          <div className="ml-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start a conversation with buyers or sellers</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'favorites':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Favorites</h3>
            
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h4 className="text-lg font-semibold">Saved Items</h4>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No favorite items yet</p>
                  <p className="text-sm text-gray-400 mt-1">Save items you're interested in by clicking the heart icon</p>
                  <Link
                    href="/marketplace"
                    className="mt-4 inline-block px-6 py-3 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button 
                  onClick={() => loadUserData(user?.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      onClick={activity.action}
                    >
                      <div className="flex items-start sm:items-center space-x-4 mb-3 sm:mb-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                          <activity.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
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
        );
    }
  };

  return (
    <>
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <aside 
          ref={sidebarRef}
          className={`hidden lg:flex flex-col ${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 z-30 fixed h-screen`}
        >
          <div className="p-6 border-b flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/logo/logo1.png"
                  alt="PilotWardrobe Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-gray-900 tracking-tight truncate">
                  Pilot<span className="text-blue-600">Wardrobe</span>
                </h1>
              )}
            </div>
          </div>

          <div className="p-6 border-b flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{user?.user_metadata?.full_name || user?.email}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 truncate">
                      {stats.activeListings > 0 ? `${stats.activeListings} Active Listings` : 'New User'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto min-h-0">
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
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge !== null && item.badge > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${activeTab === item.id ? 'bg-blue-600 text-black' : 'bg-gray-200 text-gray-700'}`}>
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
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-black rounded-xl hover:from-blue-700 hover:to-blue-800 transition"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-medium">Sell Item</span>
                </Link>
                <Link
                  href="/request-item"
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-black rounded-xl hover:from-purple-700 hover:to-purple-800 transition"
                >
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Request Item</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="p-4 border-t flex-shrink-0">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium truncate">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside 
          className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform h-screen flex flex-col`}
        >
          <div className="p-6 border-b flex-shrink-0 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo/logo1.png"
                  alt="PilotWardrobe Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold truncate">PilotWardrobe</h1>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)}><X className="w-6 h-6" /></button>
          </div>
          
          <div className="p-6 border-b flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-black font-bold text-lg">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-gray-500 truncate">
                  {stats.activeListings > 0 ? `${stats.activeListings} Active Listings` : 'New User'}
                </p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 overflow-y-auto min-h-0">
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
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span className="px-2 py-1 text-xs bg-gray-200 rounded-full flex-shrink-0">
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
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-black rounded-xl"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <PlusCircle className="w-5 h-5" />
                <span className="font-medium">Sell Item</span>
              </Link>
              <Link
                href="/request-item"
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-black rounded-xl"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Target className="w-5 h-5" />
                <span className="font-medium">Request Item</span>
              </Link>
            </div>
          </nav>
          
          <div className="p-4 border-t flex-shrink-0">
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
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'} transition-all duration-300 min-w-0`}>
          <header className="bg-white border-b px-4 sm:px-6 py-4 sticky top-0 z-20">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Menu className="w-6 h-6 lg:hidden" />
                  <ChevronRight className={`w-5 h-5 hidden lg:block transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-gray-100 rounded-xl w-full sm:w-64 lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  {stats.unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-black font-bold">
                    {user?.email?.[0]?.toUpperCase()}
                  </div>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Pilot'}! 👋
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                {stats.activeListings > 0 
                  ? `You have ${stats.activeListings} active listings and ${stats.pendingOrders} pending orders.`
                  : 'Start by listing your first item to begin selling!'}
              </p>
            </div>

            {/* Stats Cards Grid - Responsive */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
              {statsCards.map((stat, index) => (
                <div key={index} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border hover:shadow-md transition min-w-0">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                    </div>
                    <div className="text-right ml-2 min-w-0">
                      <span className={`text-xs sm:text-sm font-medium block truncate ${
                        stat.trend === 'up' ? 'text-green-600' :
                        stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold mb-1 truncate">{stat.value}</p>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="border-b overflow-x-auto">
                    <div className="flex space-x-1 p-4 min-w-max">
                      {['Listings', 'Orders', 'Requests', 'Analytics', 'Payments', 'Aviation-images'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab.toLowerCase())}
                          className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
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

                  <div className="p-4 sm:p-6">
                    {renderContent()}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/sell"
                      className="p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition group"
                    >
                      <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-black-600 group-hover:scale-110 transition" />
                      <p className="font-medium text-sm sm:text-base">Sell Gear</p>
                    </Link>
                    <Link
                      href="/request-item"
                      className="p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition group"
                    >
                      <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition" />
                      <p className="font-medium text-sm sm:text-base">Request Item</p>
                    </Link>
                    <Link
                      href="/marketplace"
                      className="p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition group"
                    >
                      <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600 group-hover:scale-110 transition" />
                      <p className="font-medium text-sm sm:text-base">Browse</p>
                    </Link>
                    <Link
                      href="/dashboard/payments"
                      className="p-3 sm:p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-center transition group"
                    >
                      <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-amber-600 group-hover:scale-110 transition" />
                      <p className="font-medium text-sm sm:text-base">Payments</p>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Recent Messages</h3>
                    <Link href="/messages" className="text-sm text-black-600 hover:text-black-700">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      messages.slice(0, 3).map((message) => (
                        <div key={message.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-sm sm:text-base">
                              {message.sender_id === user?.id ? 'You' : 'Other User'}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{message.content}</p>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">
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

                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-black">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6" />
                    <h3 className="font-semibold">Pro Tip</h3>
                  </div>
                  <p className="mb-4 text-sm sm:text-base">
                    {stats.activeListings > 0
                      ? 'Add detailed photos and accurate descriptions to increase your sales by up to 40%.'
                      : 'Start by listing high-quality photos and detailed descriptions for better sales.'}
                  </p>
                  <Link
                    href={stats.activeListings > 0 ? "/sell" : "/guide"}
                    className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-center text-sm sm:text-base"
                  >
                    Learn More
                  </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Account Status</h3>
                    <span className={`text-sm flex items-center ${
                      stats.activeListings > 0 ? 'text-green-600' : 'text-black-600'
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
                    href="/contact"
                    className="block w-full py-2 border border-blue-600 text-black-600 rounded-lg hover:bg-blue-50 transition text-center"
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