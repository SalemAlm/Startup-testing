import { Card } from '@/types'
import { Eye, EyeOff, Copy, Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { formatCardNumber, formatCurrency, maskCardNumber } from '@/utils/formatters'
import toast from 'react-hot-toast'

interface VirtualCardProps {
  card: Card
  onFreeze?: () => void
  onUnfreeze?: () => void
  showDetails?: boolean
}

export default function VirtualCard({ card, onFreeze, onUnfreeze, showDetails = false }: VirtualCardProps) {
  const [showFullNumber, setShowFullNumber] = useState(false)
  const [showCVV, setShowCVV] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  return (
    <div className="virtual-card relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>

      {/* Card Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm text-gray-400 mb-1">Cardholder</p>
            <p className="text-lg font-semibold text-white">{card.cardholderName}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">VISA</span>
            {onFreeze && onUnfreeze && (
              <button
                onClick={card.status === 'active' ? onFreeze : onUnfreeze}
                className={`p-2 rounded-lg transition-colors ${
                  card.status === 'active'
                    ? 'bg-dark-bg/50 hover:bg-dark-bg text-white'
                    : 'bg-primary/20 hover:bg-primary/30 text-primary'
                }`}
              >
                {card.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(card.balance)}</p>
        </div>

        {/* Card Details */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Card Number */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Card Number</p>
                <p className="text-white font-mono">
                  {showFullNumber ? formatCardNumber(card.cardNumber) : maskCardNumber(card.cardNumber)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFullNumber(!showFullNumber)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {showFullNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => copyToClipboard(card.cardNumber, 'Card number')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Expiry Date</p>
                <p className="text-white font-mono">{card.expiryDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">CVV</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-mono">{showCVV ? card.cvv : '***'}</p>
                  <button
                    onClick={() => setShowCVV(!showCVV)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {showCVV ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              card.status === 'active'
                ? 'bg-primary/20 text-primary'
                : card.status === 'frozen'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
