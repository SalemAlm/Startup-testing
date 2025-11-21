import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Card, TransactionCategory } from '@/types'
import { mockApi } from '@/services/mockData'
import toast from 'react-hot-toast'

interface EditCardModalProps {
  card: Card
  onClose: () => void
  onSuccess: () => void
  onDelete?: () => void
}

export default function EditCardModal({ card, onClose, onSuccess, onDelete }: EditCardModalProps) {
  const [formData, setFormData] = useState({
    limits: {
      perTransaction: card.limits.perTransaction || 0,
      daily: card.limits.daily || 0,
      weekly: card.limits.weekly || 0,
      monthly: card.limits.monthly || 0,
      total: card.limits.total || 0,
    },
    allowedCategories: card.restrictions.allowedCategories,
    allowTravel: card.restrictions.allowTravel,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories: TransactionCategory[] = [
    'food',
    'travel',
    'accommodation',
    'transportation',
    'utilities',
    'office_supplies',
    'software',
    'entertainment',
    'healthcare',
    'other',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await mockApi.updateCard(card.id, {
        limits: formData.limits,
        restrictions: {
          allowedCategories: formData.allowedCategories,
          allowTravel: formData.allowTravel,
        },
      })
      toast.success('Card updated successfully')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update card')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCategory = (category: TransactionCategory) => {
    setFormData((prev) => ({
      ...prev,
      allowedCategories: prev.allowedCategories.includes(category)
        ? prev.allowedCategories.filter((c) => c !== category)
        : [...prev.allowedCategories, category],
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-slate p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Card</h2>
            <p className="text-gray-400 text-sm mt-1">{card.cardholderName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-navy rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Spending Limits */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Spending Limits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Per Transaction</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.limits.perTransaction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      limits: { ...formData.limits, perTransaction: parseFloat(e.target.value) || 0 },
                    })
                  }
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Daily Limit</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.limits.daily}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      limits: { ...formData.limits, daily: parseFloat(e.target.value) || 0 },
                    })
                  }
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Weekly Limit</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.limits.weekly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      limits: { ...formData.limits, weekly: parseFloat(e.target.value) || 0 },
                    })
                  }
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Limit</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.limits.monthly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      limits: { ...formData.limits, monthly: parseFloat(e.target.value) || 0 },
                    })
                  }
                  placeholder="Unlimited"
                />
              </div>
            </div>
          </div>

          {/* Expense Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Allowed Expense Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 p-3 bg-dark-navy rounded-lg cursor-pointer hover:bg-dark-slate transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.allowedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-white capitalize">{category.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Travel Toggle */}
          <div>
            <label className="flex items-center gap-3 p-4 bg-dark-navy rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowTravel}
                onChange={(e) => setFormData({ ...formData, allowTravel: e.target.checked })}
                className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <div>
                <p className="text-white font-semibold">Allow Travel Expenses</p>
                <p className="text-sm text-gray-400">Enable this card for travel-related purchases</p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-4">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="w-full btn-secondary flex items-center justify-center gap-2 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
              >
                <Trash2 size={18} />
                Delete Card
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
