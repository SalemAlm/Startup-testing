import { useEffect, useState } from 'react'
import { ArrowLeft, TrendingUp, PieChart } from 'lucide-react'
import { Transaction, Card, TransactionCategory } from '@/types'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/utils/formatters'
import toast from 'react-hot-toast'

interface MobileAnalyticsProps {
  onBack: () => void
}

export default function MobileAnalytics({ onBack }: MobileAnalyticsProps) {
  const { user } = useAuthStore()
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

      const userCards = allCards.filter((c: Card) => c.userId === user?.id)
      const cardIds = userCards.map((c: Card) => c.id)
      const userTransactions = allTransactions.filter((t: Transaction) => cardIds.includes(t.cardId))
      setTransactions(userTransactions)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  // Calculate spending by category
  const categorySpending: Record<TransactionCategory, number> = {} as any
  transactions.forEach((txn) => {
    if (txn.status === 'completed') {
      categorySpending[txn.category] = (categorySpending[txn.category] || 0) + txn.amount
    }
  })

  const categoryData = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category: category as TransactionCategory, amount }))

  const totalSpending = categoryData.reduce((sum, item) => sum + item.amount, 0)

  // Calculate monthly trend (last 3 months)
  const monthlyTrend = []
  for (let i = 2; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleString('default', { month: 'short' })
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const monthTotal = transactions
      .filter((t) => {
        if (t.status !== 'completed') return false
        const txDate = new Date(t.createdAt)
        return txDate >= monthStart && txDate <= monthEnd
      })
      .reduce((sum, t) => sum + t.amount, 0)

    monthlyTrend.push({ month, amount: monthTotal })
  }

  const maxMonthlyAmount = Math.max(...monthlyTrend.map((m) => m.amount), 1)

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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-sm text-gray-400">Your spending insights</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Total Spending */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-400 mb-2">Total Spending</p>
          <p className="text-4xl font-bold text-white mb-1">{formatCurrency(totalSpending)}</p>
          <p className="text-sm text-gray-400">All time</p>
        </div>

        {/* Monthly Trend */}
        <div className="bg-dark-card rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-white">Monthly Trend</h2>
          </div>
          <div className="space-y-3">
            {monthlyTrend.map((month, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{month.month}</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(month.amount)}</span>
                </div>
                <div className="w-full bg-dark-navy rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/70 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(month.amount / maxMonthlyAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-dark-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-white">Spending by Category</h2>
          </div>
          {categoryData.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No spending data yet</p>
          ) : (
            <div className="space-y-3">
              {categoryData.map((item, index) => {
                const percentage = (item.amount / totalSpending) * 100
                return (
                  <div key={index} className="bg-dark-navy rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCategoryIcon(item.category)}</span>
                        <span className="text-white font-medium capitalize">
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(item.amount)}</p>
                        <p className="text-xs text-gray-400">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
