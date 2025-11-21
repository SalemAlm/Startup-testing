import { useState } from 'react'
import { X, DollarSign } from 'lucide-react'
import { Card } from '@/types'
import { mockApi } from '@/services/mockData'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/utils/formatters'

interface AddBalanceModalProps {
  card: Card
  onClose: () => void
  onSuccess: () => void
}

export default function AddBalanceModal({ card, onClose, onSuccess }: AddBalanceModalProps) {
  const [amount, setAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsSubmitting(true)

    try {
      await mockApi.addCardBalance(card.id, amount)
      toast.success(`Added ${formatCurrency(amount)} to card`)
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add balance')
    } finally {
      setIsSubmitting(false)
    }
  }

  const quickAmounts = [100, 500, 1000, 2500, 5000]

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-dark-slate p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Add Balance</h2>
            <p className="text-gray-400 text-sm mt-1">{card.cardholderName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-navy rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Current Balance */}
        <div className="p-6 border-b border-dark-slate">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Current Balance</p>
            <p className="text-3xl font-bold text-white mt-1">{formatCurrency(card.balance)}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount to Add (USD) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign size={20} />
              </div>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="0.00"
                className="pl-12"
                required
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-sm text-gray-400 mb-3">Quick amounts</p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount)}
                  className="px-4 py-2 bg-dark-navy hover:bg-dark-slate rounded-lg text-white transition-colors text-sm"
                >
                  ${quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* New Balance Preview */}
          {amount > 0 && (
            <div className="p-4 bg-dark-navy rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">New Balance</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(card.balance + amount)}
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || amount <= 0} className="flex-1 btn-primary">
              {isSubmitting ? 'Adding...' : 'Add Balance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
