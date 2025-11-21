import { useEffect, useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Card } from '@/types'
import { mockApi } from '@/services/mockData'
import VirtualCard from '@/components/VirtualCard'
import CreateCardModal from '@/components/CreateCardModal'
import toast from 'react-hot-toast'

export default function Cards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const data = await mockApi.getCards()
      setCards(data)
    } catch (error) {
      console.error('Failed to fetch cards:', error)
      toast.error('Failed to load cards')
    } finally {
      setLoading(false)
    }
  }

  const handleFreezeCard = async (cardId: string) => {
    try {
      await mockApi.freezeCard(cardId)
      toast.success('Card frozen successfully')
      fetchCards()
    } catch (error) {
      toast.error('Failed to freeze card')
    }
  }

  const handleUnfreezeCard = async (cardId: string) => {
    try {
      await mockApi.unfreezeCard(cardId)
      toast.success('Card unfrozen successfully')
      fetchCards()
    } catch (error) {
      toast.error('Failed to unfreeze card')
    }
  }

  const filteredCards = cards.filter(
    (card) =>
      card.cardholderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.cardNumber.includes(searchQuery)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Cards</h1>
          <p className="text-gray-400">Manage your team's virtual cards</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Card
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by cardholder or card number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter size={20} />
          Filter
        </button>
      </div>

      {/* Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div key={card.id}>
              <VirtualCard
                card={card}
                showDetails={true}
                onFreeze={() => handleFreezeCard(card.id)}
                onUnfreeze={() => handleUnfreezeCard(card.id)}
              />
              <div className="mt-4 p-4 bg-dark-card rounded-xl">
                <h4 className="text-sm font-semibold text-white mb-3">Spending Limits</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {card.limits.perTransaction && (
                    <div>
                      <p className="text-gray-400">Per Transaction</p>
                      <p className="text-white font-semibold">{formatCurrency(card.limits.perTransaction)}</p>
                    </div>
                  )}
                  {card.limits.daily && (
                    <div>
                      <p className="text-gray-400">Daily</p>
                      <p className="text-white font-semibold">{formatCurrency(card.limits.daily)}</p>
                    </div>
                  )}
                  {card.limits.monthly && (
                    <div>
                      <p className="text-gray-400">Monthly</p>
                      <p className="text-white font-semibold">{formatCurrency(card.limits.monthly)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-400">No cards found</p>
        </div>
      )}

      {/* Create Card Modal */}
      {showCreateModal && (
        <CreateCardModal onClose={() => setShowCreateModal(false)} onSuccess={() => {
          setShowCreateModal(false)
          fetchCards()
        }} />
      )}
    </div>
  )
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
