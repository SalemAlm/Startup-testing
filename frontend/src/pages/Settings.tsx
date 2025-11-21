import { useState } from 'react'
import { User, Bell, Shield, Building } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'company'>(
    'profile'
  )

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'company' as const, label: 'Company', icon: Building },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:bg-dark-navy hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileSettings user={user} />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'company' && <CompanySettings />}
        </div>
      </div>
    </div>
  )
}

function ProfileSettings({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'member',
  })

  const handleSave = () => {
    toast.success('Profile updated successfully')
  }

  return (
    <div className="card space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Profile Information</h3>
        <p className="text-sm text-gray-400">Update your personal information and email address</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
          <input
            type="text"
            value={formData.role}
            disabled
            className="bg-dark-navy cursor-not-allowed opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">Contact your admin to change your role</p>
        </div>

        <div className="pt-4">
          <button onClick={handleSave} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    transactionAlerts: true,
    approvalRequests: true,
    weeklyReports: false,
    limitWarnings: true,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success('Notification preferences updated')
  }

  return (
    <div className="card space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Notification Preferences</h3>
        <p className="text-sm text-gray-400">Manage how you receive notifications</p>
      </div>

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-dark-navy rounded-xl"
          >
            <div>
              <p className="text-white font-medium">
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim()}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
            </div>
            <button
              onClick={() => handleToggle(key as keyof typeof settings)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                value ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SecuritySettings() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    toast.success('Password updated successfully')
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="card space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Change Password</h3>
          <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button onClick={handleChangePassword} className="btn-primary">
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <button className="btn-secondary">Enable</button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="card space-y-4">
        <h3 className="text-lg font-bold text-white">Active Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-dark-navy rounded-xl">
            <div>
              <p className="text-white font-medium">Current Session</p>
              <p className="text-sm text-gray-400">macOS · Chrome · San Francisco, CA</p>
            </div>
            <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompanySettings() {
  const [formData, setFormData] = useState({
    companyName: 'Acme Corporation',
    industry: 'Technology',
    size: '50-100',
    currency: 'USD',
  })

  const handleSave = () => {
    toast.success('Company settings updated')
  }

  return (
    <div className="card space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Company Information</h3>
        <p className="text-sm text-gray-400">Manage your company settings and preferences</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="Acme Corporation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
          <select
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="50-100">50-100 employees</option>
            <option value="100-500">100-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </select>
        </div>

        <div className="pt-4">
          <button onClick={handleSave} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
