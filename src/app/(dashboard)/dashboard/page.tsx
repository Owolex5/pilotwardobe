// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'  // ← THIS WAS MISSING! Add this line

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
  Shield
} from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showNewListingModal, setShowNewListingModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkUser()

    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [router])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading cockpit...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Active Listings', value: '0', icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Earnings', value: '$0', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
    { label: 'Messages', value: '0', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
    { label: 'Profile Views', value: '0', icon: Eye, color: 'from-amber-500 to-orange-600' },
  ]

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {showNewListingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New Listing</h3>
              <button onClick={() => setShowNewListingModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-gray-600">Form coming soon...</p>
            <button onClick={() => setShowNewListingModal(false)} className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col ${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              {/* Logo with next/image */}
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
                <div>
                  <p className="font-semibold truncate">{user?.user_metadata?.full_name || user?.email}</p>
                  <p className="text-xs text-gray-500">Captain Account</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map(item => (
                <li key={item.id}>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button onClick={handleSignOut} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600">
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
          {/* Mobile sidebar content... same as desktop */}
          <nav className="p-6">
            <ul className="space-y-3">
              {sidebarItems.map(item => (
                <li key={item.id}>
                  <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-gray-50">
                    <item.icon className="w-6 h-6" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-6 border-t">
            <button onClick={handleSignOut} className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl bg-red-50 text-red-600">
              <LogOut className="w-6 h-6" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b px-6 py-4 sticky top-0 z-30">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Menu className="w-6 h-6 lg:hidden" />
                  <ChevronRight className={`w-5 h-5 hidden lg:block transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search gear, orders..." className="pl-12 pr-6 py-3 bg-gray-100 rounded-xl w-96 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button onClick={() => setShowNewListingModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5" />
                  <span>New Listing</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-auto">
            <h1 className="text-3xl font-bold mb-8">Welcome back, Captain {user?.user_metadata?.full_name?.split(' ')[0] || ''}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setShowNewListingModal(true)} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center">
                    <PlusCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Add Listing</p>
                  </button>
                  <button className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                    <p className="font-medium">Verify KYC</p>
                  </button>
                  <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium">Go Premium</p>
                  </button>
                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-medium">View Orders</p>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <p className="text-gray-500 text-center py-8">No activity yet. Start listing!</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}