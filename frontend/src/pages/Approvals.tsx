import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, CreditCard, TrendingUp } from 'lucide-react'
import { ApprovalRequest } from '@/types'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/utils/formatters'
import { formatDistanceToNow } from 'date-fns'

export default function Approvals() {
  const { user } = useAuthStore()
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      const data = await mockApi.getApprovals()
      setApprovals(data)
    } catch (error) {
      toast.error('Failed to load approval requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (approvalId: string, status: 'approved' | 'rejected') => {
    try {
      await mockApi.updateApproval(approvalId, status, user!.id, user!.name)
      toast.success(`Request ${status} successfully`)
      loadApprovals()
    } catch (error: any) {
      toast.error(error.message || `Failed to ${status} request`)
    }
  }

  const filteredApprovals = approvals.filter((approval) => {
    if (filter === 'all') return true
    return approval.status === filter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'card_creation':
        return <CreditCard size={20} />
      case 'limit_increase':
        return <TrendingUp size={20} />
      default:
        return <CreditCard size={20} />
    }
  }

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading approvals...</div>
      </div>
    )
  }

  const canApprove = user?.role === 'admin' || user?.role === 'finance'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Approval Requests</h1>
        <p className="text-gray-400 mt-2">Review and manage pending card requests</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-primary text-dark-bg'
                : 'bg-dark-navy text-gray-400 hover:bg-dark-slate'
            }`}
          >
            {status}
            {status === 'pending' && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {approvals.filter((a) => a.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      {filteredApprovals.length === 0 ? (
        <div className="card text-center py-12">
          <Clock className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No requests found</h3>
          <p className="text-gray-400">There are no {filter !== 'all' && filter} approval requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map((approval) => (
            <div key={approval.id} className="card p-6">
              <div className="flex items-start justify-between gap-6">
                {/* Request Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {getTypeIcon(approval.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{getTypeLabel(approval.type)}</h3>
                      <p className="text-sm text-gray-400">
                        Requested by {approval.requestedByName} •{' '}
                        {formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="bg-dark-navy rounded-lg p-4 space-y-2">
                    {approval.type === 'card_creation' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cardholder Name</span>
                          <span className="text-white font-medium">{approval.data.cardholderName}</span>
                        </div>
                        {approval.data.balance > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Initial Balance</span>
                            <span className="text-white font-medium">
                              {formatCurrency(approval.data.balance)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Monthly Limit</span>
                          <span className="text-white font-medium">
                            {formatCurrency(approval.data.limits.monthly || 0)}
                          </span>
                        </div>
                        {approval.data.restrictions?.allowedCategories && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Allowed Categories</span>
                            <span className="text-white font-medium">
                              {approval.data.restrictions.allowedCategories.length} categories
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {approval.type === 'limit_increase' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">New Monthly Limit</span>
                          <span className="text-white font-medium">
                            {formatCurrency(approval.data.newLimits.monthly)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Status Info */}
                  {approval.status !== 'pending' && approval.approvedByName && (
                    <div className="mt-3 text-sm text-gray-400">
                      {approval.status === 'approved' ? 'Approved' : 'Rejected'} by {approval.approvedByName} •{' '}
                      {formatDistanceToNow(new Date(approval.updatedAt), { addSuffix: true })}
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border capitalize ${getStatusBadge(
                      approval.status
                    )}`}
                  >
                    {approval.status}
                  </span>

                  {approval.status === 'pending' && canApprove && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproval(approval.id, 'rejected')}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleApproval(approval.id, 'approved')}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
