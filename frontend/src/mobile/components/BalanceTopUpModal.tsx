import { useState } from 'react'
import { X, DollarSign } from 'lucide-react'
import { Card } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface BalanceTopUpModalProps {
  card: Card
  onClose: () => void
  onSuccess: () => void
}

export default function BalanceTopUpModal({ card, onClose, onSuccess }: BalanceTopUpModalProps) {
  const { user } = useAuthStore()
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const presetAmounts = [100, 250, 500, 1000]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason')
      return
    }

    setIsSubmitting(true)
    try {
      await mockApi.createApprovalRequest({
        type: 'balance_topup',
        requestedBy: user?.id,
        requestedByName: user?.name,
        data: {
          cardId: card.id,
          cardholderName: card.cardholderName,
          amount: parsedAmount,
        },
        reason,
      })

      toast.success('Top-up request submitted! Waiting for approval.')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 animate-fadeIn">
      <div className="bg-dark-card rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-slate px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <DollarSign size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Request Top-Up</h2>
              <p className="text-sm text-gray-400">{card.cardholderName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-navy rounded-lg transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-5">
            <p className="text-sm text-gray-400 mb-2">Current Balance</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(card.balance)}</p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Top-Up Amount <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 bg-dark-navy border border-dark-slate rounded-xl text-white text-lg font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Preset Amounts */}
          <div>
            <p className="text-sm text-gray-400 mb-3">Quick Select</p>
            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                    amount === preset.toString()
                      ? 'bg-primary text-dark-bg'
                      : 'bg-dark-navy text-gray-400 hover:bg-dark-slate'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Reason <span className="text-primary">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you need this top-up..."
              rows={4}
              className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
          </div>

          {/* New Balance Preview */}
          {amount && !isNaN(parseFloat(amount)) && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">New Balance After Top-Up</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(card.balance + parseFloat(amount))}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dark-navy text-white font-semibold py-4 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-dark-bg font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
