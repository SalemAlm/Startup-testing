import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Copy, Pause, Play, Wallet, DollarSign } from 'lucide-react'
import { Card } from '@/types'
import { formatCardNumber, formatCurrency, maskCardNumber } from '@/utils/formatters'
import { mockApi } from '@/services/mockData'
import toast from 'react-hot-toast'

interface MobileCardDetailsProps {
  card: Card
  onBack: () => void
  onCardUpdated: () => void
  onRequestTopUp: (card: Card) => void
}

export default function MobileCardDetails({ card, onBack, onCardUpdated, onRequestTopUp }: MobileCardDetailsProps) {
  const [showFullNumber, setShowFullNumber] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  const handleFreezeToggle = async () => {
    const action = card.status === 'active' ? 'freeze' : 'unfreeze'
    if (!confirm(`Are you sure you want to ${action} this card?`)) {
      return
    }

    setIsProcessing(true)
    try {
      if (card.status === 'active') {
        await mockApi.freezeCard(card.id)
        toast.success('Card frozen successfully')
      } else {
        await mockApi.unfreezeCard(card.id)
        toast.success('Card unfrozen successfully')
      }
      onCardUpdated()
    } catch (error) {
      toast.error(`Failed to ${action} card`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddToApplePay = async () => {
    // In a real app, this would integrate with Apple Pay API
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await mockApi.updateCard(card.id, { addedToWallet: true })
      toast.success('Card added to Apple Wallet!')
      onCardUpdated()
    } catch (error) {
      toast.error('Failed to add to Apple Wallet')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 pt-12 pb-6 px-6">
        <button onClick={onBack} className="mb-6 p-2 -ml-2">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Card Details</h1>
      </div>

      <div className="px-6 -mt-2">
        {/* Virtual Card */}
        <div className="bg-gradient-to-br from-primary/90 to-primary rounded-2xl p-6 mb-6 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-xs text-white/70 mb-1">Cardholder</p>
                <p className="text-lg font-semibold text-white">{card.cardholderName}</p>
              </div>
              <span className="text-white font-bold text-xl">VISA</span>
            </div>

            <div className="mb-6">
              <p className="text-xs text-white/70 mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(card.balance)}</p>
            </div>

            {/* Status Badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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

        {/* Card Information */}
        <div className="bg-dark-card rounded-2xl p-5 mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Card Information</h2>

          {/* Card Number */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Card Number</p>
            <div className="flex items-center justify-between bg-dark-navy rounded-xl p-3">
              <p className="text-white font-mono text-sm">
                {showFullNumber ? formatCardNumber(card.cardNumber) : maskCardNumber(card.cardNumber)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFullNumber(!showFullNumber)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {showFullNumber ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                </button>
                <button
                  onClick={() => copyToClipboard(card.cardNumber, 'Card number')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Copy size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-2">Expiry Date</p>
              <div className="bg-dark-navy rounded-xl p-3">
                <p className="text-white font-mono">{card.expiryDate}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">CVV</p>
              <div className="bg-dark-navy rounded-xl p-3 flex items-center justify-between">
                <p className="text-white font-mono">{showCVV ? card.cvv : '***'}</p>
                <button
                  onClick={() => setShowCVV(!showCVV)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {showCVV ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Project */}
          {card.project && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Project</p>
              <div className="bg-dark-navy rounded-xl p-3">
                <p className="text-white">📁 {card.project}</p>
              </div>
            </div>
          )}
        </div>

        {/* Spending Limits */}
        <div className="bg-dark-card rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Spending Limits</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {card.limits.perTransaction && (
              <div className="bg-dark-navy rounded-xl p-3">
                <p className="text-gray-400 mb-1">Per Transaction</p>
                <p className="text-white font-semibold">{formatCurrency(card.limits.perTransaction)}</p>
              </div>
            )}
            {card.limits.daily && (
              <div className="bg-dark-navy rounded-xl p-3">
                <p className="text-gray-400 mb-1">Daily</p>
                <p className="text-white font-semibold">{formatCurrency(card.limits.daily)}</p>
              </div>
            )}
            {card.limits.monthly && (
              <div className="bg-dark-navy rounded-xl p-3">
                <p className="text-gray-400 mb-1">Monthly</p>
                <p className="text-white font-semibold">{formatCurrency(card.limits.monthly)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!card.addedToWallet && (
            <button
              onClick={handleAddToApplePay}
              disabled={isProcessing || card.status !== 'active'}
              className="w-full bg-black text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-transform"
            >
              <Wallet size={20} />
              Add to Apple Pay
            </button>
          )}

          {card.addedToWallet && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
              <p className="text-primary font-medium">✓ Added to Apple Wallet</p>
            </div>
          )}

          <button
            onClick={() => onRequestTopUp(card)}
            className="w-full bg-primary/10 border border-primary/30 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 active:scale-98 transition-transform"
          >
            <DollarSign size={20} />
            Request Balance Top-Up
          </button>

          <button
            onClick={handleFreezeToggle}
            disabled={isProcessing}
            className={`w-full font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-transform ${
              card.status === 'active'
                ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                : 'bg-primary/10 border border-primary/30 text-primary'
            }`}
          >
            {card.status === 'active' ? <Pause size={20} /> : <Play size={20} />}
            {card.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
          </button>
        </div>
      </div>
    </div>
  )
}
