// app/admin/messages/page.tsx - FINAL VERSION
'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  MessageSquare,
  Users,
  Shield,
  ChevronLeft,
  User,
  Plus,
  Eye,
  RefreshCw,
  Mail,
  Calendar,
  Send,
  ShieldCheck,
  AlertCircle,
  X,
  Archive,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Filter,
  MoreVertical,
  Download,
  Tag
} from 'lucide-react'

interface ChatThread {
  id: string
  title: string
  created_at: string
  updated_at: string
  is_group: boolean
  swap_match_id?: string
  last_message?: string
  last_message_at: string
  unread_count: number
  participants: Array<{
    user_id: string
    name: string
    is_admin: boolean
  }>
  has_admin: boolean
  is_active: boolean
}

export default function AdminMessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    unread: 0
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread.id)
      markThreadAsRead(activeThread.id)
    }
  }, [activeThread])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkUser = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/signin')
        return
      }

      setUser(user)
      
      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
        router.push('/dashboard')
        return
      }

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      await loadAllThreads()
      setLoading(false)
    } catch (error) {
      console.error('Auth error:', error)
      setError('Authentication failed')
      setLoading(false)
    }
  }

  const loadAllThreads = async () => {
    try {
      setError(null)
      
      // Load all threads
      const { data: threadsData, error: threadsError } = await supabase
        .from('chat_threads')
        .select('*')
        .order('updated_at', { ascending: false })

      if (threadsError) {
        console.error('Threads query error:', threadsError)
        setThreads([])
        return
      }

      if (!threadsData || threadsData.length === 0) {
        setThreads([])
        setStats({ total: 0, active: 0, pending: 0, unread: 0 })
        return
      }

      // Process each thread
  const processedThreads = await Promise.all(
  threadsData.map(async (thread) => {
    try {
      // Get participants for this thread - use correct join syntax
      const { data: participants } = await supabase
        .from('chat_thread_participants')
        .select(`
          user_id,
          is_admin
        `)
        .eq('thread_id', thread.id)

      // Get profile names separately
      const participantIds = participants?.map(p => p.user_id).filter(Boolean) || []
      let profilesMap = new Map<string, string>()
      
      if (participantIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', participantIds)
        
        profilesData?.forEach(profile => {
          if (profile.id) {
            profilesMap.set(profile.id, profile.full_name || 'Unknown User')
          }
        })
      }

      // Get latest message
      const { data: latestMessage } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('thread_id', thread.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Get unread count for admin
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('thread_id', thread.id)
        .neq('sender_id', user?.id)
        .or(`read_by.is.null,read_by.not.cs.{${user?.id}}`)

      // Check if admin is already a participant
      const hasAdmin = participants?.some(p => p.user_id === user?.id && p.is_admin) || false
      const isActive = thread.updated_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      return {
        id: thread.id,
        title: thread.title || 'Untitled Conversation',
        created_at: thread.created_at,
        updated_at: thread.updated_at,
        is_group: thread.is_group || false,
        swap_match_id: thread.swap_match_id,
        last_message: latestMessage?.content,
        last_message_at: latestMessage?.created_at || thread.updated_at,
        unread_count: unreadCount || 0,
        participants: participants?.map(p => ({
          user_id: p.user_id,
          name: profilesMap.get(p.user_id) || 'Unknown User',
          is_admin: p.is_admin
        })) || [],
        has_admin: hasAdmin,
        is_active: isActive
      }
    } catch (error) {
      console.error('Error processing thread:', thread.id, error)
      return null
    }
  })
)

      // Filter out null results and update state
      const validThreads = processedThreads.filter(Boolean) as ChatThread[]
      setThreads(validThreads)
      calculateStats(validThreads)

    } catch (error) {
      console.error('Error loading threads:', error)
      setError('Failed to load conversations')
      setThreads([])
    }
  }

  const calculateStats = (threadsList: ChatThread[]) => {
    const total = threadsList.length
    const active = threadsList.filter(t => t.is_active).length
    const pending = threadsList.filter(t => !t.has_admin).length
    const unread = threadsList.reduce((sum, thread) => sum + thread.unread_count, 0)

    setStats({
      total,
      active,
      pending,
      unread
    })
  }

  const loadMessages = async (threadId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey(full_name)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Messages error:', error)
        setMessages([])
        return
      }

      setMessages(messagesData || [])
    } catch (error) {
      console.error('Error loading messages:', error)
      setMessages([])
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread || !user || sending) return

    setSending(true)
    try {
      // First, make sure admin is a participant
      if (!activeThread.has_admin) {
        await joinThreadAsAdmin(activeThread.id)
      }

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          thread_id: activeThread.id,
          sender_id: user.id,
          content: newMessage.trim(),
          is_admin_message: true,
          read_by: [user.id]
        })
        .select(`
          *,
          profiles!messages_sender_id_fkey(full_name)
        `)
        .single()

      if (error) throw error

      // Update thread's updated_at
      await supabase
        .from('chat_threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeThread.id)

      setNewMessage('')
      
      // Add to local state
      setMessages(prev => [...prev, message])
      
      // Update thread's last message
      setThreads(prev => prev.map(thread => 
        thread.id === activeThread.id 
          ? { 
              ...thread, 
              last_message: newMessage,
              last_message_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              has_admin: true 
            }
          : thread
      ))

    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const joinThreadAsAdmin = async (threadId: string) => {
    if (!user) return
    
    try {
      // Add admin to participants
      const { error: participantError } = await supabase
        .from('chat_thread_participants')
        .upsert({
          thread_id: threadId,
          user_id: user.id,
          is_admin: true,
          joined_at: new Date().toISOString()
        })

      if (participantError) throw participantError

      // Send system message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content: "👋 Admin has joined this conversation to help facilitate the wardrobe swap.",
          is_admin_message: true,
          is_system_message: true,
          read_by: [user.id],
          created_at: new Date().toISOString()
        })

      if (messageError) throw messageError

      // Update local state
      setThreads(prev => prev.map(thread => 
        thread.id === threadId ? { ...thread, has_admin: true } : thread
      ))

      // Update stats
      setStats(prev => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1)
      }))

      // Update active thread if it's the current one
      if (activeThread?.id === threadId) {
        setActiveThread(prev => prev ? { ...prev, has_admin: true } : null)
      }

      // Reload messages to show the system message
      if (activeThread?.id === threadId) {
        await loadMessages(threadId)
      }

    } catch (error) {
      console.error('Error joining thread:', error)
      setError('Failed to join thread')
    }
  }

  const leaveThread = async (threadId: string) => {
    if (!user) return
    
    try {
      // Remove admin from participants
      const { error } = await supabase
        .from('chat_thread_participants')
        .delete()
        .eq('thread_id', threadId)
        .eq('user_id', user.id)

      if (error) throw error

      // Send system message
      await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content: "🏃 Admin has left the conversation.",
          is_admin_message: true,
          is_system_message: true,
          read_by: [user.id],
          created_at: new Date().toISOString()
        })

      // Update local state
      setThreads(prev => prev.map(thread => 
        thread.id === threadId ? { ...thread, has_admin: false } : thread
      ))

      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending + 1
      }))

      // Update active thread if it's the current one
      if (activeThread?.id === threadId) {
        setActiveThread(prev => prev ? { ...prev, has_admin: false } : null)
      }

    } catch (error) {
      console.error('Error leaving thread:', error)
      setError('Failed to leave thread')
    }
  }

  const archiveThread = async (threadId: string) => {
    try {
      await supabase
        .from('chat_threads')
        .update({ 
          updated_at: new Date().toISOString(),
          is_archived: true 
        })
        .eq('id', threadId)

      // Update local state
      setThreads(prev => prev.filter(thread => thread.id !== threadId))

      // Update stats
      const thread = threads.find(t => t.id === threadId)
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        active: thread?.is_active ? prev.active - 1 : prev.active,
        pending: thread?.has_admin ? prev.pending : prev.pending - 1
      }))

      // Clear active thread if it's the current one
      if (activeThread?.id === threadId) {
        setActiveThread(null)
        setMessages([])
      }

    } catch (error) {
      console.error('Error archiving thread:', error)
      setError('Failed to archive thread')
    }
  }

  const markThreadAsRead = async (threadId: string) => {
    if (!user) return

    try {
      // Get messages not read by admin
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id, read_by')
        .eq('thread_id', threadId)
        .or(`read_by.is.null,read_by.not.cs.{${user.id}}`)

      if (!unreadMessages || unreadMessages.length === 0) return

      // Mark each unread message as read by admin
      for (const msg of unreadMessages) {
        const readBy = msg.read_by ? [...msg.read_by, user.id] : [user.id]
        
        await supabase
          .from('messages')
          .update({ read_by: readBy })
          .eq('id', msg.id)
      }

      // Update local state
      setThreads(prev => prev.map(thread => 
        thread.id === threadId ? { ...thread, unread_count: 0 } : thread
      ))

    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else if (diffDays === 1) {
        return 'Yesterday'
      } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' })
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      }
    } catch {
      return 'Recently'
    }
  }

  const getThreadTitle = (thread: ChatThread) => {
    if (thread.title && thread.title !== 'Untitled Conversation') return thread.title
    
    const otherParticipants = thread.participants.filter(p => p.user_id !== user?.id)
    if (otherParticipants.length === 1) {
      return otherParticipants[0].name
    } else if (otherParticipants.length === 2) {
      return `${otherParticipants[0].name} & ${otherParticipants[1].name}`
    } else if (otherParticipants.length > 0) {
      return `${otherParticipants.length} people`
    } else {
      return 'Conversation'
    }
  }

  const filteredThreads = threads.filter(thread => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        getThreadTitle(thread).toLowerCase().includes(query) ||
        thread.last_message?.toLowerCase().includes(query) ||
        thread.participants.some(p => p.name.toLowerCase().includes(query))
      )
    }

    // Type filter
    if (filterType !== 'all') {
      switch (filterType) {
        case 'active':
          return thread.is_active
        case 'pending':
          return !thread.has_admin
        case 'archived':
          return !thread.is_active
        case 'admin':
          return thread.has_admin
        case 'unread':
          return thread.unread_count > 0
        default:
          return true
      }
    }

    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin messages...</p>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Messages</h1>
              <p className="text-gray-600">Monitor and facilitate conversations</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadAllThreads}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.total}</p>
            <p className="text-gray-600">Conversations</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600">Active</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.active}</p>
            <p className="text-gray-600">Active Now</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-yellow-600">Need Help</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.pending}</p>
            <p className="text-gray-600">Require Admin</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-purple-600">Unread</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.unread}</p>
            <p className="text-gray-600">Unread Messages</p>
          </div>
        </div>

        <div className="flex h-[calc(100vh-280px)]">
          {/* Threads Sidebar */}
          <div className="w-full md:w-96 bg-white border rounded-xl mr-6 flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b">
              <div className="flex flex-col space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Conversations</option>
                  <option value="active">Active</option>
                  <option value="pending">Need Admin Help</option>
                  <option value="admin">Admin Joined</option>
                  <option value="unread">Unread Messages</option>
                </select>
              </div>
            </div>

            {/* Threads List */}
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-700 mb-2">No conversations found</h3>
                  <p className="text-gray-500 text-sm">
                    {threads.length === 0 
                      ? 'No conversations yet.' 
                      : 'Try adjusting your filters'}
                  </p>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThread(thread)}
                    className={`p-4 border-b cursor-pointer transition ${
                      activeThread?.id === thread.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {thread.has_admin ? (
                            <ShieldCheck className="w-4 h-4 text-purple-500" />
                          ) : (
                            <Users className="w-4 h-4 text-gray-400" />
                          )}
                          <h3 className="font-semibold truncate text-sm">
                            {getThreadTitle(thread)}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {thread.last_message || 'No messages yet'}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs text-gray-500 mb-1">
                          {formatTime(thread.last_message_at)}
                        </span>
                        {thread.unread_count > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-600 text-white rounded-full">
                            {thread.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {thread.participants.length} participant{thread.participants.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {!thread.has_admin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              joinThreadAsAdmin(thread.id)
                            }}
                            className="p-1 hover:bg-green-100 rounded text-green-600"
                            title="Join as Admin"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        )}
                        {thread.has_admin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              leaveThread(thread.id)
                            }}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                            title="Leave Thread"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white border rounded-xl flex flex-col">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="border-b p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h2 className="font-bold text-lg truncate">
                          {getThreadTitle(activeThread)}
                        </h2>
                        {activeThread.has_admin && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Admin Joined
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {activeThread.participants.length} participant{activeThread.participants.length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-sm text-gray-500">
                          Created: {new Date(activeThread.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!activeThread.has_admin ? (
                        <button
                          onClick={() => joinThreadAsAdmin(activeThread.id)}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Join as Admin</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => leaveThread(activeThread.id)}
                            className="px-3 py-1.5 border border-red-600 text-red-600 rounded-lg text-sm hover:bg-red-50"
                          >
                            Leave
                          </button>
                          <button
                            onClick={() => archiveThread(activeThread.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                            title="Archive Thread"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No messages yet.</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Start the conversation as an admin
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwnMessage = msg.sender_id === user?.id
                        const isAdmin = msg.is_admin_message
                        const isSystem = msg.is_system_message

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                isSystem
                                  ? 'bg-yellow-50 text-yellow-800 mx-auto text-center'
                                  : isOwnMessage
                                  ? 'bg-blue-600 text-white'
                                  : isAdmin
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-white border border-gray-200'
                              }`}
                            >
                              {!isOwnMessage && !isSystem && (
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-sm">
                                    {msg.profiles?.full_name || 'User'}
                                  </span>
                                  {isAdmin && (
                                    <Shield className="w-3 h-3 text-purple-600" />
                                  )}
                                </div>
                              )}
                              <p className="text-sm">{msg.content}</p>
                              <div className={`flex items-center justify-end mt-1 space-x-2 ${
                                isOwnMessage ? 'text-blue-200' : 'text-gray-400'
                              }`}>
                                <span className="text-xs">
                                  {formatTime(msg.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="max-w-3xl mx-auto flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={activeThread.has_admin ? "Type your admin message..." : "Join the thread to send messages"}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={sending || !activeThread.has_admin}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending || !activeThread.has_admin}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      title={!activeThread.has_admin ? "Join the thread first to send messages" : "Send message"}
                    >
                      <Send className="w-4 h-4" />
                      <span>{sending ? 'Sending...' : 'Send'}</span>
                    </button>
                  </div>
                  {!activeThread.has_admin && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Click "Join as Admin" to participate in this conversation
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a conversation</h3>
                  <p className="text-gray-500 max-w-md">
                    Choose a conversation from the sidebar to monitor or help facilitate
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}