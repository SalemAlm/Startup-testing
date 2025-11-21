import { useEffect, useState } from 'react'
import { CreditCard, TrendingUp, DollarSign, Bell } from 'lucide-react'
import { Card, Transaction } from '@/types'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/utils/formatters'
import toast from 'react-hot-toast'

export default function MobileHome() {
  const { user } = useAuthStore()
  const [cards, setCards] = useState<Card[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [allCards, allTransactions] = await Promise.all([
        mockApi.getCards(),
        mockApi.getTransactions(),
      ])

      // Filter cards for current user
      const userCards = allCards.filter((c: Card) => c.userId === user?.id)
      setCards(userCards)

      // Filter transactions for user's cards
      const cardIds = userCards.map((c: Card) => c.id)
      const userTransactions = allTransactions
        .filter((t: Transaction) => cardIds.includes(t.cardId))
        .slice(0, 5)
      setTransactions(userTransactions)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0)
  const activeCards = cards.filter(c => c.status === 'active').length

  // Calculate monthly spending
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthlySpend = transactions
    .filter(t => new Date(t.createdAt) >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0)

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
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 pt-12 pb-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
          </div>
          <button className="p-3 bg-dark-card rounded-full relative">
            <Bell size={20} className="text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-primary" />
              <p className="text-xs text-gray-400">Total Balance</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</p>
          </div>
          <div className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={16} className="text-primary" />
              <p className="text-xs text-gray-400">Active Cards</p>
            </div>
            <p className="text-2xl font-bold text-white">{activeCards}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Monthly Spending */}
        <div className="bg-dark-card rounded-2xl p-5 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-white">Monthly Spending</h2>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatCurrency(monthlySpend)}</p>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>

          {transactions.length === 0 ? (
            <div className="bg-dark-card rounded-2xl p-8 text-center">
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-dark-card rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.merchant}</p>
                      <p className="text-xs text-gray-400">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">-{formatCurrency(transaction.amount)}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-primary/20 text-primary'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-card rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
              <CreditCard size={24} className="text-primary mx-auto mb-2" />
              <p className="text-white font-medium text-sm">Request Card</p>
            </button>
            <button className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
              <DollarSign size={24} className="text-primary mx-auto mb-2" />
              <p className="text-white font-medium text-sm">Top Up</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: '🍔',
    travel: '✈️',
    accommodation: '🏨',
    transportation: '🚗',
    utilities: '💡',
    office_supplies: '📎',
    software: '💻',
    entertainment: '🎬',
    healthcare: '🏥',
    other: '📦',
  }
  return icons[category] || '💳'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
