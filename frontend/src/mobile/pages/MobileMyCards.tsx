import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card } from '@/types'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import MobileCard from '../components/MobileCard'
import toast from 'react-hot-toast'

interface MobileMyCardsProps {
  onCardClick: (card: Card) => void
  onRequestCard: () => void
}

export default function MobileMyCards({ onCardClick, onRequestCard }: MobileMyCardsProps) {
  const { user } = useAuthStore()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'frozen'>('all')

  useEffect(() => {
    fetchCards()
  }, [user])

  const fetchCards = async () => {
    try {
      const allCards = await mockApi.getCards()
      const userCards = allCards.filter((c: Card) => c.userId === user?.id)
      setCards(userCards)
    } catch (error) {
      console.error('Failed to fetch cards:', error)
      toast.error('Failed to load cards')
    } finally {
      setLoading(false)
    }
  }

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.cardholderName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">My Cards</h1>
          <button
            onClick={onRequestCard}
            className="p-3 bg-primary rounded-full"
          >
            <Plus size={20} className="text-dark-bg" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-card/80 backdrop-blur-sm border border-dark-slate rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="px-6 -mt-2">
        {/* Status Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'frozen'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-primary text-dark-bg'
                  : 'bg-dark-card text-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Cards List */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <p className="text-white font-semibold mb-2">No cards yet</p>
            <p className="text-gray-400 text-sm mb-6">Request your first card to get started</p>
            <button
              onClick={onRequestCard}
              className="bg-primary text-dark-bg font-semibold py-3 px-6 rounded-xl"
            >
              Request Card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCards.map((card) => (
              <div key={card.id} onClick={() => onCardClick(card)}>
                <MobileCard card={card} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
