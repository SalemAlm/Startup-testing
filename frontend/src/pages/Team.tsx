import { useEffect, useState } from 'react'
import { Plus, Mail, Trash2, X } from 'lucide-react'
import { User } from '@/types'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import { formatDateTime } from '@/utils/formatters'
import toast from 'react-hot-toast'

export default function Team() {
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const { user: currentUser } = useAuthStore()

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const data = await mockApi.getTeamMembers()
      setMembers(data)
    } catch (error) {
      console.error('Failed to fetch team members:', error)
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return

    try {
      await mockApi.deleteTeamMember(userId)
      toast.success('Team member removed')
      fetchTeamMembers()
    } catch (error) {
      toast.error('Failed to remove team member')
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      finance: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      member: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    }
    return styles[role as keyof typeof styles] || styles.member
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Team</h1>
          <p className="text-gray-400">Manage team members and their roles</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Invite Member
          </button>
        )}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total Members</p>
          <p className="text-2xl font-bold text-white">{members.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Admins</p>
          <p className="text-2xl font-bold text-white">
            {members.filter((m) => m.role === 'admin').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Active Members</p>
          <p className="text-2xl font-bold text-white">{members.length}</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="card">
        <div className="space-y-1">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 hover:bg-dark-navy rounded-xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-white">{member.name}</p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border ${getRoleBadge(member.role)}`}
                    >
                      {member.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-400">{member.email}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">
                      Joined {formatDateTime(member.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {currentUser?.role === 'admin' && currentUser.id !== member.id && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false)
            fetchTeamMembers()
          }}
        />
      )}
    </div>
  )
}

function InviteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member' as 'admin' | 'finance' | 'member',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await mockApi.inviteTeamMember(formData)
      toast.success(`Invitation sent to ${formData.email}`)
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to invite team member')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-dark-slate p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Invite Team Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-navy rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as 'admin' | 'finance' | 'member' })
              }
              className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="member">Member - Basic access to assigned cards</option>
              <option value="finance">Finance - Can approve requests and manage budgets</option>
              <option value="admin">Admin - Full access to all features</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary">
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
