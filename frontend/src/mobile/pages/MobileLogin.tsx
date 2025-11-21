import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { mockApi } from '@/services/mockData'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface MobileLoginProps {
  onLoginSuccess: () => void
}

export default function MobileLogin({ onLoginSuccess }: MobileLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setToken } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { user, token } = await mockApi.login(email, password)
      setUser(user)
      setToken(token)
      toast.success('Welcome back!')
      onLoginSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 pt-12 pb-24 px-6">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <LogIn size={32} className="text-dark-bg" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your CardFlow account</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 -mt-12 px-6">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="bg-dark-card rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-dark-navy border border-dark-slate rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-dark-bg font-semibold py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-dark-card/50 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">Demo credentials:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>• member@company.com / member123</p>
              <p>• finance@company.com / finance123</p>
              <p>• admin@company.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
