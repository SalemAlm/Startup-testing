import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  BarChart3,
  Users,
  Settings,
  Bell,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [notificationCount] = useState(3)

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Cards', path: '/cards', icon: CreditCard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-card border-r border-dark-slate flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-dark-slate">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-xl p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-dark-bg">
                <rect x="4" y="8" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="6" y="6" width="12" height="2" rx="1" fill="currentColor"/>
                <circle cx="8" cy="13" r="1" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">CardFlow</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-dark-bg font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-dark-navy'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-dark-slate">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-dark-bg font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-navy rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-dark-card border-b border-dark-slate px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {navigation.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell size={24} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-dark-bg text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
