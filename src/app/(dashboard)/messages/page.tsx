'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  MessageSquare,
  Users,
  User,
  Package,
  Send,
  UserPlus,
  ChevronLeft,
  AlertCircle,
  X,
  Info,
  Shield,
  Check,
  CheckCheck
} from 'lucide-react'
import { Database } from '@/types/database.types'

// Extract useful types from generated schema
type ChatThreadRow = Database['public']['Tables']['chat_threads']['Row']
type ChatThreadInsert = Database['public']['Tables']['chat_threads']['Insert']
type ChatThreadUpdate = Database['public']['Tables']['chat_threads']['Update']

type MessageRow = Database['public']['Tables']['messages']['Row']
type MessageInsert = Database['public']['Tables']['messages']['Insert']

type ParticipantRow = Database['public']['Tables']['chat_thread_participants']['Row']
type ParticipantInsert = Database['public']['Tables']['chat_thread_participants']['Insert']

type ProfileRow = Database['public']['Tables']['profiles']['Row']

type SwapProposalRow = Database['public']['Tables']['swap_proposals']['Row']

// Local UI types
interface ChatThread {
  id: string;
  title?: string | null;
  last_message?: string;
  last_message_at?: string;
  created_at?: string;  // Add this
  unread_count: number;
  participants: {
    id: string;
    name: string;
    is_admin: boolean;
  }[];
  swap_proposal?: {
    id: string;
    title: string | null;
    status: string;
  };
}

interface Message {
  id: string
  content: string
  sender_id: string
  sender_name: string
  is_admin_message: boolean
  is_system_message: boolean
  created_at: string
  read_by: string[]
}

interface UserProfile {
  id: string
  full_name?: string | null
  avatar_url?: string | null
}

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserList, setShowUserList] = useState(false)
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatTitleInput, setChatTitleInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const loadMessages = async (threadId: string) => {
  try {
    setError(null)
    
    // Try a simpler join syntax
    const { data: messagesData, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles!messages_sender_id_fkey (
          full_name
        )
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Messages query error:', error)
      setMessages([])
      return
    }

    // Format messages with the joined profile data
    const formatted: Message[] = (messagesData || []).map(msg => {
      // Access the joined profile data
      const profile = (msg as any).profiles
      const senderName = profile?.full_name || 'Unknown User'
      
      return {
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        sender_name: senderName,
        is_admin_message: msg.is_admin_message || false,
        is_system_message: msg.is_system_message || false,
        created_at: msg.created_at || new Date().toISOString(),
        read_by: msg.read_by || []
      }
    })

    setMessages(formatted)
  } catch (err) {
    console.error('Error loading messages:', err)
    setError('Failed to load messages')
  }
}

  // Define markThreadAsRead before it's used
 const markThreadAsRead = async (threadId: string) => {
  if (!user) return

  try {
    // Get unread messages for this thread
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('id, read_by')
      .eq('thread_id', threadId)
      .not('read_by', 'cs', `{${user.id}}`)

    if (!unreadMessages || unreadMessages.length === 0) return

    // Update each message
    const updates = unreadMessages.map(msg => 
      supabase
        .from('messages')
        .update({
          read_by: [...(msg.read_by || []), user.id]
        })
        .eq('id', msg.id)
    )

    await Promise.all(updates)
      
    // Update local state
    setThreads(prev => prev.map(thread => 
      thread.id === threadId ? { ...thread, unread_count: 0 } : thread
    ))
  } catch (error) {
    console.error('Error marking as read:', error)
  }
}
  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      if (!user) {
        router.push('/signin')
      } else {
        setUser(user)
        await loadThreads(user.id)
        setLoading(false)
      }
    } catch (err) {
      console.error('Error checking user:', err)
      setError('Failed to load user data')
      setLoading(false)
    }
  }

  const loadThreads = async (userId: string) => {
    try {
      setError(null)

      const { data: participantsData, error: participantsError } = await supabase
        .from('chat_thread_participants')
        .select('thread_id')
        .eq('user_id', userId)

      if (participantsError) {
        if (participantsError.code === '42P01') {
          setThreads([])
          return
        }
        throw participantsError
      }

      if (!participantsData?.length) {
        setThreads([])
        return
      }

      const threadIds = participantsData.map(p => p.thread_id)

      // Simplified query without the problematic join
      const { data: threadsData, error: threadsError } = await supabase
        .from('chat_threads')
        .select('id, title, created_at, updated_at, is_group, swap_match_id')
        .in('id', threadIds)
        .order('updated_at', { ascending: false })

      if (threadsError) throw threadsError

      const formattedThreads = await Promise.all(
        (threadsData || []).map(async (thread) => {
          // Get last message safely
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('thread_id', thread.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          const lastMessage = lastMessageData

          // Unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id)
            .not('read_by', 'cs', `{${userId}}`)

          // Participants
          const { data: participants } = await supabase
            .from('chat_thread_participants')
            .select(`
              user_id,
              is_admin,
              profile:profiles(full_name)
            `)
            .eq('thread_id', thread.id)

          // Load swap proposal separately if swap_match_id exists
          let swapProposal = undefined
          if (thread.swap_match_id) {
            try {
              // First get the swap match
              const { data: swapMatch } = await supabase
                .from('swap_matches')
                .select('proposal_id')
                .eq('id', thread.swap_match_id)
                .single()

              if (swapMatch?.proposal_id) {
                // Then get the swap proposal
                const { data: proposal } = await supabase
                  .from('swap_proposals')
                  .select('id, title, status')
                  .eq('id', swapMatch.proposal_id)
                  .single()

                if (proposal) {
                  swapProposal = {
                    id: proposal.id,
                    title: proposal.title ?? 'Untitled Swap',
                    status: proposal.status
                  }
                }
              }
            } catch (err) {
              console.log('Error loading swap proposal:', err)
            }
          }

          return {
            id: thread.id,
            title: thread.title ?? 'New Conversation',
            last_message: lastMessage?.content ?? undefined,
            last_message_at: lastMessage?.created_at ?? thread.updated_at ?? thread.created_at,
            unread_count: unreadCount ?? 0,
            participants: (participants || []).map((p: any) => ({
              id: p.user_id,
              name: p.profile?.full_name || 'Unknown User',
              is_admin: p.is_admin
            })),
            swap_proposal: swapProposal
          }
        })
      )

      setThreads(formattedThreads.filter(Boolean))
    } catch (err: any) {
      console.error('Error loading threads:', err)
      setError(err.message || 'Failed to load conversations')
    }
  }

  // ... rest of your functions (sendMessage, createNewThread, scrollToBottom, etc.)
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread || !user || sending) return

    setSending(true)
    try {
      const insertPayload: MessageInsert = {
        thread_id: activeThread.id,
        sender_id: user.id,
        content: newMessage.trim(),
        is_admin_message: false,
        read_by: [user.id]
      }

      const { data: message, error } = await supabase
        .from('messages')
        .insert(insertPayload)
        .select()
        .single()

      if (error) throw error

      const updatePayload: ChatThreadUpdate = {
        updated_at: new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('chat_threads')
        .update(updatePayload)
        .eq('id', activeThread.id)

      if (updateError) throw updateError

      setNewMessage('')

      const newMsg: Message = {
        id: message.id,
        content: message.content,
        sender_id: user.id,
        sender_name: user.user_metadata?.full_name || 'You',
        is_admin_message: false,
        is_system_message: false,
        created_at: message.created_at,
        read_by: message.read_by || [user.id]
      }

      setMessages(prev => [...prev, newMsg])

      setThreads(prev =>
        prev.map(t =>
          t.id === activeThread.id
            ? { ...t, last_message: newMsg.content, last_message_at: newMsg.created_at }
            : t
        )
      )
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const createNewThread = async (participantIds: string[]) => {
    if (!user) return

    try {
      setError(null)

      const threadPayload: ChatThreadInsert = {
        title: chatTitleInput || null,
        is_group: participantIds.length > 1
      }

      const { data: thread, error: threadError } = await supabase
        .from('chat_threads')
        .insert(threadPayload)
        .select()
        .single()

      if (threadError) throw threadError

      const allParticipants = [user.id, ...participantIds]
      const participantsData: ParticipantInsert[] = allParticipants.map(id => ({
        thread_id: thread.id,
        user_id: id,
        is_admin: id === user.id
      }))

      const { error: participantsError } = await supabase
        .from('chat_thread_participants')
        .insert(participantsData)

      if (participantsError) throw participantsError

      await loadThreads(user.id)

      const newThread: ChatThread = {
        id: thread.id,
        title: chatTitleInput || 'New Conversation',
        last_message: undefined,
        last_message_at: thread.created_at,
        unread_count: 0,
        participants: [],
        swap_proposal: undefined
      }

      setActiveThread(newThread)
      setShowUserList(false)
      setChatTitleInput('')
    } catch (err) {
      console.error('Error creating thread:', err)
      setError('Failed to create chat')
    }
  }

  // const markThreadAsRead = async (threadId: string) => {
  //   if (!user) return
  //   try {
  //     await supabase
  //       .from('messages')
  //       .update({ read_by: supabase.sql`array_append(read_by, ${user.id})` })
  //       .eq('thread_id', threadId)
  //       .not('read_by', 'cs', `{${user.id}}`)

  //     setThreads(prev =>
  //       prev.map(t => (t.id === threadId ? { ...t, unread_count: 0 } : t))
  //     )
  //   } catch (err) {
  //     console.error('Error marking as read:', err)
  //   }
  // }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .neq('id', user?.id)
        .limit(50)

      if (error) throw error
      setAllUsers(data || [])
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' })
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } catch {
      return 'Recently'
    }
  }

  const getThreadTitle = (thread: ChatThread) => {
    if (thread.title && thread.title !== 'Swap Discussion') return thread.title

    const others = thread.participants.filter(p => p.id !== user?.id)
    if (others.length === 1) return others[0].name || 'Unknown User'
    if (others.length === 2) return `${others[0].name || 'User'} & ${others[1].name || 'User'}`
    if (others.length > 2) return `${others.length} people`
    return thread.title || 'Conversation'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Chat with swap partners and admin support</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowUserList(true)
              loadAllUsers()
              setChatTitleInput('')
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-700 mb-2">No conversations yet</h3>
                <p className="text-gray-500 text-sm mb-6">
                  When you submit a swap proposal, a chat thread will be created here
                </p>
                <Link href="/SwapExchange" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Submit a Swap Proposal
                </Link>
              </div>
            ) : (
              threads
                .filter(t =>
                  getThreadTitle(t).toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(thread => (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThread(thread)}
                    className={`p-4 border-b cursor-pointer transition ${
                      activeThread?.id === thread.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {thread.swap_proposal ? (
                            <Package className="w-4 h-4 text-blue-500" />
                          ) : thread.participants.length > 2 ? (
                            <Users className="w-4 h-4 text-gray-400" />
                          ) : (
                            <User className="w-4 h-4 text-gray-400" />
                          )}
                          <h3 className="font-semibold truncate">{getThreadTitle(thread)}</h3>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {thread.last_message || 'No messages yet'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          {formatTime(thread.last_message_at || thread.created_at)}
                        </span>
                        {thread.unread_count > 0 && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                    </div>
                    {thread.swap_proposal && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          thread.swap_proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          thread.swap_proposal.status === 'matched' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {thread.swap_proposal.status}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {thread.swap_proposal.title}
                        </span>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeThread ? (
            <>
              <div className="bg-white border-b p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-lg">{getThreadTitle(activeThread)}</h2>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                      <span>{activeThread.participants.length} participant{activeThread.participants.length !== 1 ? 's' : ''}</span>
                      {activeThread.swap_proposal && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          activeThread.swap_proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activeThread.swap_proposal.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-3xl mx-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      {activeThread.swap_proposal && (
                        <p className="text-sm text-gray-400 mt-2">
                          This chat is for discussing your swap: "{activeThread.swap_proposal.title}"
                        </p>
                      )}
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isOwn = msg.sender_id === user?.id
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            msg.is_system_message ? 'bg-yellow-50 text-yellow-800 mx-auto' :
                            isOwn ? 'bg-blue-600 text-white' :
                            msg.is_admin_message ? 'bg-purple-100 text-purple-800' :
                            'bg-white border border-gray-200'
                          }`}>
                            {!isOwn && !msg.is_system_message && (
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-sm">{msg.sender_name}</span>
                                {msg.is_admin_message && <Shield className="w-3 h-3 text-purple-600" />}
                              </div>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <div className={`flex items-center justify-end mt-1 space-x-2 text-xs ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                              <span>{formatTime(msg.created_at)}</span>
                              {isOwn && (msg.read_by.length > 1 ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="bg-white border-t p-4">
                <div className="max-w-3xl mx-auto flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-gray-500">
                {threads.length > 0 ? 'Choose a thread from the sidebar' : 'Submit a swap proposal to start chatting'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showUserList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Start New Chat</h2>
                <button onClick={() => setShowUserList(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chat Title (Optional)</label>
                  <input
                    type="text"
                    value={chatTitleInput}
                    onChange={e => setChatTitleInput(e.target.value)}
                    placeholder="e.g., Bose A20 Swap Discussion"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Participant</label>
                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    {allUsers.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">Loading users...</div>
                    ) : (
                      allUsers.map(u => (
                        <div
                          key={u.id}
                          onClick={() => createNewThread([u.id])}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="font-medium">{u.full_name || 'Unknown User'}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={() => setShowUserList(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}