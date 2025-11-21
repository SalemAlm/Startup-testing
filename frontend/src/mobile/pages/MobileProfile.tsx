import { ArrowLeft, User, Mail, Briefcase, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface MobileProfileProps {
  onBack: () => void
  onLogout: () => void
}

export default function MobileProfile({ onBack, onLogout }: MobileProfileProps) {
  const { user } = useAuthStore()

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      onLogout()
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 pt-12 pb-8 px-6">
        <button onClick={onBack} className="mb-6 p-2 -ml-2">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
            <User size={40} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Profile Information */}
        <div className="bg-dark-card rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Briefcase size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-white font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        {user?.permissions && (
          <div className="bg-dark-card rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-white">Permissions</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(user.permissions).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-xl text-sm ${
                    value
                      ? 'bg-primary/10 border border-primary/30 text-primary'
                      : 'bg-dark-navy text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{value ? '✓' : '✗'}</span>
                    <span className="capitalize text-xs">
                      {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="bg-dark-card rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Member Since</span>
              <span className="text-white font-medium text-sm">
                {new Date(user?.createdAt || '').toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">User ID</span>
              <span className="text-white font-mono text-xs">{user?.id}</span>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-dark-card rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">App Information</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Version</span>
              <span className="text-white font-medium text-sm">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Build</span>
              <span className="text-white font-medium text-sm">2024.01</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-4 rounded-xl flex items-center justify-center gap-3 active:scale-98 transition-transform"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  )
}
