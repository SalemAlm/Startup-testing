import { Card } from '@/types'
import { formatCurrency, maskCardNumber } from '@/utils/formatters'

interface MobileCardProps {
  card: Card
  onClick?: () => void
}

export default function MobileCard({ card, onClick }: MobileCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative bg-gradient-to-br from-primary/90 to-primary rounded-2xl p-6 overflow-hidden cursor-pointer active:scale-98 transition-transform"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-white/70 mb-1">Cardholder</p>
            <p className="text-lg font-semibold text-white">{card.cardholderName}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">VISA</span>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <p className="text-xs text-white/70 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(card.balance)}</p>
        </div>

        {/* Card Number */}
        <div className="flex items-center justify-between">
          <p className="text-white/90 font-mono text-sm">{maskCardNumber(card.cardNumber)}</p>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                card.status === 'active'
                  ? 'bg-white/20 text-white'
                  : card.status === 'frozen'
                  ? 'bg-blue-500/20 text-blue-100'
                  : 'bg-red-500/20 text-red-100'
              }`}
            >
              {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Project Tag */}
        {card.project && (
          <div className="mt-3">
            <span className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-lg">
              📁 {card.project}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
