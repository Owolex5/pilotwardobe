// app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Users,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    verified: 0,
    admins: 0
  })

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, statusFilter, roleFilter])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
      setFilteredUsers(data || [])

      // Calculate stats
      const stats = {
        total: data?.length || 0,
        active: data?.filter(u => u.status === 'active').length || 0,
        suspended: data?.filter(u => u.status === 'suspended').length || 0,
        verified: data?.filter(u => u.email_confirmed_at).length || 0,
        admins: data?.filter(u => u.role === 'admin').length || 0
      }
      setUserStats(stats)

    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) ||
        (user.full_name && user.full_name.toLowerCase().includes(query))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const updateUserStatus = async (userId: string, status: string, reason?: string) => {
    try {
      await supabase
        .from('profiles')
        .update({ 
          status,
          suspension_reason: reason,
          suspended_at: status === 'suspended' ? new Date().toISOString() : null
        })
        .eq('id', userId)

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status, suspension_reason: reason } : user
      ))

      // Update stats
      setUserStats(prev => ({
        ...prev,
        active: status === 'active' ? prev.active + 1 : prev.active - 1,
        suspended: status === 'suspended' ? prev.suspended + 1 : prev.suspended - 1
      }))

    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ))

      // Update stats
      setUserStats(prev => ({
        ...prev,
        admins: role === 'admin' ? prev.admins + 1 : prev.admins - 1
      }))

    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const bulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return

    if (action === 'suspend') {
      for (const userId of selectedUsers) {
        await updateUserStatus(userId, 'suspended', 'Bulk action by admin')
      }
    } else if (action === 'activate') {
      for (const userId of selectedUsers) {
        await updateUserStatus(userId, 'active')
      }
    } else if (action === 'makeAdmin') {
      for (const userId of selectedUsers) {
        await updateUserRole(userId, 'admin')
      }
    }

    setSelectedUsers([])
  }

  const exportUsers = () => {
    const csv = [
      ['Email', 'Name', 'Role', 'Status', 'Joined', 'Last Active'],
      ...filteredUsers.map(user => [
        user.email,
        user.full_name || '',
        user.role || 'user',
        user.status || 'active',
        new Date(user.created_at).toLocaleDateString(),
        user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const UserStatsCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-gray-500">{change}</span>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-gray-600">{title}</p>
    </div>
  )

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
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage all users in the system</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportUsers}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      <main className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <UserStatsCard
            title="Total Users"
            value={userStats.total}
            icon={Users}
            color="bg-blue-500"
            change="+12 this month"
          />
          <UserStatsCard
            title="Active Users"
            value={userStats.active}
            icon={UserCheck}
            color="bg-green-500"
            change="94% active"
          />
          <UserStatsCard
            title="Suspended"
            value={userStats.suspended}
            icon={UserX}
            color="bg-red-500"
            change="2 new"
          />
          <UserStatsCard
            title="Verified"
            value={userStats.verified}
            icon={CheckCircle}
            color="bg-emerald-500"
            change="87% verified"
          />
          <UserStatsCard
            title="Admins"
            value={userStats.admins}
            icon={Shield}
            color="bg-purple-500"
            change="3 total"
          />
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
                    placeholder="Search by email or name..."
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
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="p-4 bg-blue-50 border-b">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => bulkAction('activate')}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => bulkAction('suspend')}
                    className="px-3 py-1 border border-red-600 text-red-600 rounded-lg text-sm hover:bg-red-50"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={() => bulkAction('makeAdmin')}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                  >
                    Make Admin
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-4 px-6 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">User</th>
                  <th className="py-4 px-6 text-left font-semibold">Role</th>
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                  <th className="py-4 px-6 text-left font-semibold">Joined</th>
                  <th className="py-4 px-6 text-left font-semibold">Last Active</th>
                  <th className="py-4 px-6 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id])
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                            {user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.full_name || 'Anonymous'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.phone && (
                              <p className="text-sm text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.status || 'active'}
                          onChange={(e) => updateUserStatus(user.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {user.last_sign_in_at ? (
                          new Date(user.last_sign_in_at).toLocaleDateString()
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <MoreVertical className="w-4 h-4" />
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
                Showing {filteredUsers.length} of {users.length} users
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