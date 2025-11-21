import { useState } from 'react'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { TransactionCategory } from '@/types'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface MobileCardRequestProps {
  onBack: () => void
  onSuccess: () => void
}

export default function MobileCardRequest({ onBack, onSuccess }: MobileCardRequestProps) {
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    project: '',
    reason: '',
    limits: {
      perTransaction: 500,
      daily: 1000,
      monthly: 5000,
    },
    allowedCategories: [] as TransactionCategory[],
    allowTravel: false,
  })

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

  const toggleCategory = (category: TransactionCategory) => {
    setFormData((prev) => ({
      ...prev,
      allowedCategories: prev.allowedCategories.includes(category)
        ? prev.allowedCategories.filter((c) => c !== category)
        : [...prev.allowedCategories, category],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.project.trim()) {
      toast.error('Please enter a project name')
      return
    }

    if (formData.allowedCategories.length === 0) {
      toast.error('Please select at least one category')
      return
    }

    setIsSubmitting(true)
    try {
      await mockApi.createApprovalRequest({
        type: 'card_creation',
        requestedBy: user?.id,
        requestedByName: user?.name,
        data: {
          cardholderName: user?.name,
          userId: user?.id,
          userName: user?.name,
          project: formData.project,
          limits: formData.limits,
          restrictions: {
            allowedCategories: formData.allowedCategories,
            allowTravel: formData.allowTravel,
          },
        },
        reason: formData.reason,
      })

      toast.success('Card request submitted! Waiting for approval.')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 pt-12 pb-6 px-6 sticky top-0 z-10">
        <button onClick={onBack} className="mb-6 p-2 -ml-2">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <CreditCard size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Request Card</h1>
            <p className="text-sm text-gray-400">Fill in the details below</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* Project */}
        <div className="bg-dark-card rounded-2xl p-5">
          <label className="block text-sm font-semibold text-white mb-3">
            Project Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            placeholder="e.g., Marketing Campaign Q1"
            className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* Reason */}
        <div className="bg-dark-card rounded-2xl p-5">
          <label className="block text-sm font-semibold text-white mb-3">Reason for Request</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Briefly explain why you need this card..."
            rows={3}
            className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Spending Limits */}
        <div className="bg-dark-card rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Requested Spending Limits</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Per Transaction ($)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.limits.perTransaction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, perTransaction: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Daily Limit ($)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.limits.daily}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, daily: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Monthly Limit ($)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.limits.monthly}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, monthly: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-dark-card rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">
            Allowed Categories <span className="text-primary">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <label
                key={category}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors ${
                  formData.allowedCategories.includes(category)
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-dark-navy border-2 border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.allowedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="sr-only"
                />
                <span className="text-sm text-white capitalize">{category.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Travel Toggle */}
        <div className="bg-dark-card rounded-2xl p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.allowTravel}
              onChange={(e) => setFormData({ ...formData, allowTravel: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary focus:ring-offset-0"
            />
            <div className="flex-1">
              <p className="text-white font-semibold">Allow Travel Expenses</p>
              <p className="text-sm text-gray-400 mt-1">Enable this card for travel-related purchases</p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-20 bg-dark-bg pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-dark-bg font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-transform"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
