// app/request-item/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/components/Common/Breadcrumb'

import {
  Target,
  Search,
  Bell,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Package,
  Plane,
  Drone,
  Wrench,
  ShoppingBag,
  Send,
  ArrowRight,
  Zap
} from 'lucide-react'

export default function RequestItemPage() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [requestId, setRequestId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  
  const [request, setRequest] = useState({
    // Contact info
    name: '',
    email: '',
    phone: '',
    
    // Item details
    title: '',
    item_type: 'gear',
    category: '',
    manufacturer: '',
    model: '',
    part_number: '',
    year: '',
    
    // Request specifics
    urgency: 'medium',
    budget_min: '',
    budget_max: '',
    description: '',
    
    // Preferences
    notify_via_email: true,
    notify_via_sms: false,
    accept_similar_items: true,
    status: 'pending',
    notification_count: 0,
    matched_listings: []
  })
  
  const categories = [
    'Headsets',
    'Uniforms',
    'Flight Bags',
    'Watches',
    'Kneeboards',
    'Sunglasses',
    'Logbooks',
    'Drones',
    'Avionics',
    'Engines & Props',
    'Airframe Parts',
    'Instruments',
    'Interior',
    'Other Aircraft Parts',
    'Other Gear',
  ]
  
  const itemTypes = [
    { value: 'gear', label: 'Pilot Gear', icon: ShoppingBag, color: 'bg-blue-500' },
    { value: 'aircraft', label: 'Aircraft', icon: Plane, color: 'bg-emerald-500' },
    { value: 'drone', label: 'Drone', icon: Drone, color: 'bg-purple-500' },
    { value: 'part', label: 'Aircraft Part', icon: Wrench, color: 'bg-amber-500' },
    { value: 'other', label: 'Other', icon: Package, color: 'bg-gray-500' },
  ]
  
  const urgencyLevels = [
    { 
      value: 'low', 
      label: 'Casual Search', 
      desc: 'No rush, just browsing',
      icon: Clock,
      color: 'bg-gray-100 text-gray-700'
    },
    { 
      value: 'medium', 
      label: 'Planning Purchase', 
      desc: 'In next 1-3 months',
      icon: Search,
      color: 'bg-blue-100 text-blue-700'
    },
    { 
      value: 'high', 
      label: 'Active Need', 
      desc: 'Within 30 days',
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-700'
    },
    { 
      value: 'urgent', 
      label: 'Urgent Need', 
      desc: 'Immediate replacement',
      icon: Zap,
      color: 'bg-red-100 text-red-700'
    },
  ]
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      // Insert request into database
      const { data, error } = await supabase
        .from('item_requests')
        .insert([
          {
            user_id: user?.id,
            user_email: request.email || user?.email,
            user_name: request.name || user?.user_metadata?.full_name,
            user_phone: request.phone,
            
            title: request.title,
            item_type: request.item_type,
            category: request.category,
            manufacturer: request.manufacturer,
            model: request.model,
            part_number: request.part_number,
            year: request.year ? parseInt(request.year) : null,
            
            urgency: request.urgency,
            budget_min: request.budget_min ? parseFloat(request.budget_min) : null,
            budget_max: request.budget_max ? parseFloat(request.budget_max) : null,
            description: request.description,
            
            notify_via_email: request.notify_via_email,
            notify_via_sms: request.notify_via_sms,
            accept_similar_items: request.accept_similar_items,
            status: 'pending',
            notification_count: 0,
            matched_listings: []
          }
        ])
        .select()
        .single()
      
      if (error) throw error
      
      setRequestId(data.id)
      setIsSubmitted(true)
      
      // Send confirmation email (you'll need to implement this)
      // await sendRequestConfirmation(request.email, data.id, request.title)
      
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Create item_requests table if it doesn't exist
  const createRequestsTable = async () => {
    // This would be run as a migration
    // For now, we'll assume the table exists or create it via Supabase dashboard
  }

  return (
    <>
      <Breadcrumb 
        title="Request an Item" 
        pages={["Home", "Request Item"]} 
      />
      
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {isSubmitted ? (
            <div className="text-center py-16 px-8">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center">
                <Target className="w-20 h-20 text-emerald-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Request Submitted Successfully! 🎯
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We're now searching our network for your item. You'll be the first to know when we find a match.
              </p>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto mb-12">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="text-left">
                    <p className="text-sm text-gray-500 mb-1">Request ID</p>
                    <p className="font-mono font-bold text-lg text-gray-900">{requestId.slice(0, 12)}...</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500 mb-1">Item Requested</p>
                    <p className="font-bold text-lg text-gray-900">{request.title}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500 mb-1">Notification Email</p>
                    <p className="font-bold text-lg text-gray-900">{request.email}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500 mb-1">Priority Level</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      request.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                      request.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                      request.urgency === 'medium' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {urgencyLevels.find(u => u.value === request.urgency)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-8">
                  <h3 className="font-bold text-xl mb-6 text-gray-900">What happens next?</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Active Search</h4>
                      <p className="text-gray-600 text-sm">We search across 500+ suppliers</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bell className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Instant Alert</h4>
                      <p className="text-gray-600 text-sm">Get notified within 24 hours</p>
                    </div>
                    <div className="text-center p-6 bg-emerald-50 rounded-xl">
                      <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Exclusive Access</h4>
                      <p className="text-gray-600 text-sm">48-hour priority before public</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg flex items-center justify-center gap-3"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setRequest({
                      name: '',
                      email: '',
                      phone: '',
                      title: '',
                      item_type: 'gear',
                      category: '',
                      manufacturer: '',
                      model: '',
                      part_number: '',
                      year: '',
                      urgency: 'medium',
                      budget_min: '',
                      budget_max: '',
                      description: '',
                      notify_via_email: true,
                      notify_via_sms: false,
                      accept_similar_items: true,
                      status: 'pending',
                      notification_count: 0,
                      matched_listings: []
                    })
                  }}
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 transition"
                >
                  Request Another Item
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 lg:p-12">
                <div className="text-center mb-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <Target className="w-10 h-10 text-blue-600" />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Can't Find What You Need?
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Request any aviation gear or part. We'll notify you the moment it becomes available.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      Contact Information
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={request.name}
                          onChange={(e) => setRequest({ ...request, name: e.target.value })}
                          required
                          placeholder="Captain Sarah Connor"
                          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={request.email}
                          onChange={(e) => setRequest({ ...request, email: e.target.value })}
                          required
                          placeholder="sarah@example.com"
                          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 transition"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Item Details */}
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      Item Details
                    </h2>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                          What are you looking for? *
                        </label>
                        <input
                          type="text"
                          value={request.title}
                          onChange={(e) => setRequest({ ...request, title: e.target.value })}
                          required
                          placeholder="e.g., Bose A30 Aviation Headset, Garmin GNS 530W, Cessna 172 Seat"
                          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 transition"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                          Item Type *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {itemTypes.map((type) => (
                            <button
                              type="button"
                              key={type.value}
                              onClick={() => setRequest({ ...request, item_type: type.value })}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                request.item_type === type.value
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                              }`}
                            >
                              <div className={`w-10 h-10 mx-auto mb-3 ${type.color} rounded-lg flex items-center justify-center`}>
                                <type.icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-3">
                            Category *
                          </label>
                          <select
                            value={request.category}
                            onChange={(e) => setRequest({ ...request, category: e.target.value })}
                            required
                            className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 transition bg-white"
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat.toLowerCase()}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-3">
                            Manufacturer (optional)
                          </label>
                          <input
                            type="text"
                            value={request.manufacturer}
                            onChange={(e) => setRequest({ ...request, manufacturer: e.target.value })}
                            placeholder="e.g., Bose, Garmin, Jeppesen"
                            className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 transition"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Additional Details (optional)
                        </label>
                        <textarea
                          value={request.description}
                          onChange={(e) => setRequest({ ...request, description: e.target.value })}
                          rows={4}
                          placeholder="Describe condition preferences, specific requirements, accessories needed, etc."
                          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 transition resize-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Budget & Urgency */}
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                      </div>
                      Budget & Urgency
                    </h2>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                          How urgent is your need? *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {urgencyLevels.map((level) => (
                            <button
                              type="button"
                              key={level.value}
                              onClick={() => setRequest({ ...request, urgency: level.value })}
                              className={`p-5 rounded-xl border-2 text-left transition ${
                                request.urgency === level.value
                                  ? `${level.color} border-current shadow-md`
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <level.icon className="w-5 h-5" />
                                <span className="font-bold">{level.label}</span>
                              </div>
                              <p className="text-sm">{level.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-3">
                            Budget Range (optional)
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                  type="number"
                                  value={request.budget_min}
                                  onChange={(e) => setRequest({ ...request, budget_min: e.target.value })}
                                  placeholder="500"
                                  min="0"
                                  className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 transition"
                                />
                              </div>
                              <p className="text-sm text-gray-500 mt-2 text-center">Minimum</p>
                            </div>
                            <div className="pt-6">—</div>
                            <div className="flex-1">
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                  type="number"
                                  value={request.budget_max}
                                  onChange={(e) => setRequest({ ...request, budget_max: e.target.value })}
                                  placeholder="1500"
                                  min="0"
                                  className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 transition"
                                />
                              </div>
                              <p className="text-sm text-gray-500 mt-2 text-center">Maximum</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <label className="flex items-start gap-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={request.accept_similar_items}
                              onChange={(e) => setRequest({ ...request, accept_similar_items: e.target.checked })}
                              className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500/30"
                            />
                            <div>
                              <span className="font-semibold text-gray-900">Notify me about similar items</span>
                              <p className="text-sm text-gray-600">Get suggestions for comparable products</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit */}
<div className="text-center pt-6">
  <button
    type="submit"
    disabled={loading || !request.name || !request.email || !request.title || !request.category}
    className="min-w-[280px] px-16 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 rounded-xl transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto border-0"
  >
    {loading ? (
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        <span className="text-blue font-bold text-xl">Processing...</span>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        {/* Explicitly wrapping in a span to force text color visibility */}
        <span className="text-blue font-bold text-xl inline-block">
          Submit Request
        </span>
        <Send className="w-6 h-6 text-white" />
      </div>
    )}
  </button>
  
  <p className="text-gray-600 mt-4 text-sm">
    By submitting, you agree to our notifications. No spam, ever.
  </p>
</div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}