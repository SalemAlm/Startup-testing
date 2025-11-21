import { useEffect, useState } from 'react'
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react'
import { Notification } from '@/types'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface MobileNotificationsProps {
  onBack: () => void
}

export default function MobileNotifications({ onBack }: MobileNotificationsProps) {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [user])

  const fetchNotifications = async () => {
    try {
      const data = await mockApi.getNotifications(user?.id || '')
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await mockApi.markNotificationRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 pt-12 pb-6 px-6">
        <button onClick={onBack} className="mb-6 p-2 -ml-2">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-400 mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                notifications.forEach((n) => {
                  if (!n.read) handleMarkAsRead(n.id)
                })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-xl text-sm font-medium"
            >
              <CheckCheck size={16} />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="px-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <p className="text-white font-semibold mb-2">No notifications</p>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                className={`rounded-xl p-4 cursor-pointer transition-all ${
                  notification.read
                    ? 'bg-dark-card'
                    : 'bg-primary/10 border-2 border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.read ? 'bg-dark-navy' : 'bg-primary/20'
                    }`}
                  >
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p
                        className={`font-semibold ${
                          notification.read ? 'text-gray-400' : 'text-white'
                        }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        notification.read ? 'text-gray-500' : 'text-gray-300'
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    transaction: '💳',
    approval: '✅',
    limit_warning: '⚠️',
    card_status: '🔒',
  }
  return icons[type] || '🔔'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
