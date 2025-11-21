import { useEffect, useState } from 'react'
import { Search, Filter, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Transaction } from '@/types'
import { mockApi } from '@/services/mockData'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import toast from 'react-hot-toast'

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'declined'>('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const data = await mockApi.getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions
    .filter((txn) => {
      const matchesSearch =
        txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || txn.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-primary" size={20} />
      case 'pending':
        return <Clock className="text-orange-400" size={20} />
      case 'declined':
        return <AlertCircle className="text-red-400" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-primary bg-primary/10'
      case 'pending':
        return 'text-orange-400 bg-orange-400/10'
      case 'declined':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

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
          <h1 className="text-2xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-gray-400">View and manage all transaction history</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by merchant, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 bg-dark-card border border-dark-slate rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-white">{transactions.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">This Month</p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(
              transactions
                .filter((t) => {
                  const txnDate = new Date(t.createdAt)
                  const now = new Date()
                  return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear()
                })
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        {filteredTransactions.length > 0 ? (
          <div className="space-y-1">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-dark-navy rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-dark-slate flex items-center justify-center text-white font-semibold">
                    {transaction.merchant.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-white">{transaction.merchant}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{formatDateTime(transaction.createdAt)}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400 capitalize">
                        {transaction.category.replace('_', ' ')}
                      </span>
                      {transaction.description && (
                        <>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">{transaction.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-white text-lg">{formatCurrency(transaction.amount)}</p>
                    <p className="text-xs text-gray-400">{transaction.currency}</p>
                  </div>
                  {getStatusIcon(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}
