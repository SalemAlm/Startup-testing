import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, PieChart, Calendar } from 'lucide-react'
import { mockApi } from '@/services/mockData'
import { formatCurrency } from '@/utils/formatters'
import toast from 'react-hot-toast'

interface CategoryData {
  category: string
  amount: number
}

interface TrendData {
  month: string
  amount: number
}

export default function Analytics() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [categories, trend] = await Promise.all([
        mockApi.getSpendingByCategory(),
        mockApi.getSpendingTrend(),
      ])
      setCategoryData(categories)
      setTrendData(trend)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const totalSpending = categoryData.reduce((sum, cat) => sum + cat.amount, 0)
  const maxCategoryAmount = Math.max(...categoryData.map((c) => c.amount), 1)
  const maxTrendAmount = Math.max(...trendData.map((t) => t.amount), 1)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-orange-500',
      travel: 'bg-blue-500',
      accommodation: 'bg-purple-500',
      transportation: 'bg-cyan-500',
      utilities: 'bg-yellow-500',
      office_supplies: 'bg-green-500',
      software: 'bg-indigo-500',
      entertainment: 'bg-pink-500',
      healthcare: 'bg-red-500',
      other: 'bg-gray-500',
    }
    return colors[category] || colors.other
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
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Spending insights and reports</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card card-hover">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Total Spending</p>
            <DollarSign className="text-primary" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalSpending)}</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">This Month</p>
            <Calendar className="text-blue-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(trendData[trendData.length - 1]?.amount || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Categories</p>
            <PieChart className="text-purple-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{categoryData.length}</p>
          <p className="text-xs text-gray-500 mt-1">Active</p>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Avg per Month</p>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(trendData.reduce((sum, t) => sum + t.amount, 0) / trendData.length || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">Spending Trend</h3>
        <div className="space-y-4">
          {trendData.map((data, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400 w-16">{data.month}</span>
                <div className="flex-1 mx-4 bg-dark-navy rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(data.amount / maxTrendAmount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-white w-24 text-right">
                  {formatCurrency(data.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending by Category */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">Spending by Category</h3>
        <div className="space-y-4">
          {categoryData
            .sort((a, b) => b.amount - a.amount)
            .map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(data.category)}`} />
                    <span className="text-sm text-white capitalize">
                      {data.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">
                      {((data.amount / totalSpending) * 100).toFixed(1)}%
                    </span>
                    <span className="text-sm font-semibold text-white w-24 text-right">
                      {formatCurrency(data.amount)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-dark-navy rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${getCategoryColor(data.category)} transition-all duration-500`}
                    style={{ width: `${(data.amount / maxCategoryAmount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Category Distribution Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-6">Top Categories</h3>
          <div className="space-y-3">
            {categoryData
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-navy rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-500">#{index + 1}</div>
                    <div>
                      <p className="text-white font-semibold capitalize">
                        {data.category.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {((data.amount / totalSpending) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatCurrency(data.amount)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-white mb-6">Recent Trends</h3>
          <div className="space-y-4">
            {trendData.slice(-3).map((data, index) => (
              <div key={index} className="p-4 bg-dark-navy rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{data.month}</p>
                    <p className="text-sm text-gray-400">Monthly spending</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{formatCurrency(data.amount)}</p>
                    {index > 0 && (
                      <p
                        className={`text-xs ${
                          data.amount > trendData[trendData.length - 3 + index - 1].amount
                            ? 'text-red-400'
                            : 'text-green-400'
                        }`}
                      >
                        {data.amount > trendData[trendData.length - 3 + index - 1].amount ? '↑' : '↓'}{' '}
                        {Math.abs(
                          ((data.amount - trendData[trendData.length - 3 + index - 1].amount) /
                            trendData[trendData.length - 3 + index - 1].amount) *
                            100
                        ).toFixed(1)}
                        %
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
