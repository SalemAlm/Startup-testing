import { useEffect, useState } from 'react'
import { ArrowLeft, Search, Filter, Upload } from 'lucide-react'
import { Transaction, Card, TransactionCategory } from '@/types'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/utils/formatters'
import toast from 'react-hot-toast'

interface MobileTransactionsProps {
  onBack: () => void
  onUploadReceipt: (transaction: Transaction) => void
}

export default function MobileTransactions({ onBack, onUploadReceipt }: MobileTransactionsProps) {
  const { user } = useAuthStore()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)

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
      setCards(userCards)

      const cardIds = userCards.map((c: Card) => c.id)
      const userTransactions = allTransactions.filter((t: Transaction) => cardIds.includes(t.cardId))
      setTransactions(userTransactions)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || txn.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories: (TransactionCategory | 'all')[] = [
    'all',
    'food',
    'travel',
    'accommodation',
    'transportation',
    'software',
    'office_supplies',
    'other',
  ]

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
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 pt-12 pb-6 px-6 sticky top-0 z-10">
        <button onClick={onBack} className="mb-6 p-2 -ml-2">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white mb-4">Transactions</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-card/80 backdrop-blur-sm border border-dark-slate rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            showFilters ? 'bg-primary text-dark-bg' : 'bg-dark-card text-white'
          }`}
        >
          <Filter size={18} />
          <span className="text-sm font-medium">Filter by Category</span>
        </button>
      </div>

      <div className="px-6">
        {/* Category Filters */}
        {showFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  categoryFilter === category
                    ? 'bg-primary text-dark-bg'
                    : 'bg-dark-card text-gray-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-white font-semibold mb-2">No transactions found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const card = cards.find(c => c.id === transaction.cardId)
              return (
                <div
                  key={transaction.id}
                  className="bg-dark-card rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{getCategoryIcon(transaction.category)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{transaction.merchant}</p>
                        <p className="text-sm text-gray-400 truncate">{transaction.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {card?.cardholderName} • {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-white font-bold">-{formatCurrency(transaction.amount)}</p>
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
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

                  {/* Upload Receipt Button */}
                  {!transaction.receiptId && transaction.status === 'completed' && (
                    <button
                      onClick={() => onUploadReceipt(transaction)}
                      className="w-full bg-primary/10 border border-primary/30 text-primary font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm active:scale-98 transition-transform"
                    >
                      <Upload size={16} />
                      Upload Receipt
                    </button>
                  )}

                  {transaction.receiptId && (
                    <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 font-medium py-2 px-4 rounded-lg text-center text-sm">
                      ✓ Receipt Uploaded
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
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
