import { useEffect, useState } from 'react'
import { CreditCard, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { DashboardStats, Transaction } from '@/types'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import VirtualCard from '@/components/VirtualCard'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const data = await mockApi.getDashboardStats(user?.id || '1')
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
        <p className="text-gray-400">Here's what's happening with your corporate cards today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <CreditCard className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Cards</p>
          <p className="text-3xl font-bold text-white">{stats?.totalCards || 0}</p>
          <p className="text-sm text-primary mt-2">{stats?.activeCards || 0} active</p>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <TrendingUp className="text-blue-400" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Spend</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(stats?.totalSpend || 0)}</p>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <TrendingUp className="text-purple-400" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(stats?.monthlySpend || 0)}</p>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Clock className="text-orange-400" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Pending Approvals</p>
          <p className="text-3xl font-bold text-white">{stats?.pendingApprovals || 0}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <button className="text-primary hover:text-primary-dark text-sm font-semibold">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
            stats.recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle className="text-primary" size={20} />
      case 'pending':
        return <Clock className="text-orange-400" size={20} />
      case 'declined':
        return <AlertCircle className="text-red-400" size={20} />
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-dark-navy rounded-xl hover:bg-dark-slate/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-dark-slate flex items-center justify-center text-white font-semibold">
          {transaction.merchant.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-white">{transaction.merchant}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{formatDateTime(transaction.createdAt)}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400 capitalize">{transaction.category.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-white">{formatCurrency(transaction.amount)}</p>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  )
}
