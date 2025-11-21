import { useState } from 'react'
import { X, Shield } from 'lucide-react'
import { User, UserPermissions } from '@/types'
import { mockApi } from '@/services/mockData'
import toast from 'react-hot-toast'

interface TeamPermissionsModalProps {
  member: User
  onClose: () => void
  onSuccess: () => void
}

export default function TeamPermissionsModal({ member, onClose, onSuccess }: TeamPermissionsModalProps) {
  const [permissions, setPermissions] = useState<UserPermissions>(
    member.permissions || {
      canCreateCards: false,
      canApproveRequests: false,
      canManageTeam: false,
      canViewAllCards: false,
      canViewAnalytics: false,
      canManageSettings: false,
      canFreezeCards: false,
      canEditCards: false,
    }
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const permissionLabels = {
    canCreateCards: {
      label: 'Create Cards',
      description: 'Allow creating new card requests',
    },
    canApproveRequests: {
      label: 'Approve Requests',
      description: 'Approve or reject card creation requests',
    },
    canManageTeam: {
      label: 'Manage Team',
      description: 'Invite and remove team members',
    },
    canViewAllCards: {
      label: 'View All Cards',
      description: 'View all company cards, not just own cards',
    },
    canViewAnalytics: {
      label: 'View Analytics',
      description: 'Access spending analytics and reports',
    },
    canManageSettings: {
      label: 'Manage Settings',
      description: 'Modify company and account settings',
    },
    canFreezeCards: {
      label: 'Freeze Cards',
      description: 'Freeze and unfreeze cards',
    },
    canEditCards: {
      label: 'Edit Cards',
      description: 'Modify card limits and restrictions',
    },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await mockApi.updateTeamMemberPermissions(member.id, permissions)
      toast.success('Permissions updated successfully')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update permissions')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePermission = (key: keyof UserPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const setAllPermissions = (value: boolean) => {
    const newPermissions: UserPermissions = {
      canCreateCards: value,
      canApproveRequests: value,
      canManageTeam: value,
      canViewAllCards: value,
      canViewAnalytics: value,
      canManageSettings: value,
      canFreezeCards: value,
      canEditCards: value,
    }
    setPermissions(newPermissions)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-slate p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Manage Permissions</h2>
              <p className="text-gray-400 text-sm mt-1">
                {member.name} - <span className="capitalize">{member.role}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-navy rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAllPermissions(true)}
              className="flex-1 px-4 py-2 bg-dark-navy hover:bg-dark-slate rounded-lg text-white text-sm transition-colors"
            >
              Grant All
            </button>
            <button
              type="button"
              onClick={() => setAllPermissions(false)}
              className="flex-1 px-4 py-2 bg-dark-navy hover:bg-dark-slate rounded-lg text-white text-sm transition-colors"
            >
              Revoke All
            </button>
          </div>

          {/* Permissions List */}
          <div className="space-y-3">
            {Object.entries(permissionLabels).map(([key, { label, description }]) => (
              <label
                key={key}
                className="flex items-start gap-4 p-4 bg-dark-navy rounded-lg cursor-pointer hover:bg-dark-slate transition-colors"
              >
                <input
                  type="checkbox"
                  checked={permissions[key as keyof UserPermissions]}
                  onChange={() => togglePermission(key as keyof UserPermissions)}
                  className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary focus:ring-offset-0 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">{label}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-dark-slate">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary">
              {isSubmitting ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
