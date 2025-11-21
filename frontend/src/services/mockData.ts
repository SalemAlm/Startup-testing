import { User, Card, Transaction, DashboardStats, ApprovalRequest, Notification } from '@/types'

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    password: 'admin123', // In real app, this would be hashed
    name: 'Admin User',
    role: 'admin',
    companyId: 'company-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'finance@company.com',
    password: 'finance123',
    name: 'Finance Manager',
    role: 'finance',
    companyId: 'company-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'member@company.com',
    password: 'member123',
    name: 'Team Member',
    role: 'member',
    companyId: 'company-1',
    createdAt: new Date().toISOString(),
  },
]

// Mock Cards
export const MOCK_CARDS: Card[] = [
  {
    id: 'card-1',
    cardNumber: '4532 1234 5678 9010',
    cardholderName: 'Admin User',
    expiryDate: '12/25',
    cvv: '123',
    balance: 5000,
    status: 'active',
    userId: '1',
    userName: 'Admin User',
    limits: {
      perTransaction: 1000,
      daily: 2000,
      monthly: 10000,
    },
    restrictions: {
      allowedCategories: ['food', 'travel', 'software', 'office_supplies'],
      allowTravel: true,
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'card-2',
    cardNumber: '4532 2345 6789 0123',
    cardholderName: 'Finance Manager',
    expiryDate: '11/25',
    cvv: '456',
    balance: 8000,
    status: 'active',
    userId: '2',
    userName: 'Finance Manager',
    limits: {
      perTransaction: 2000,
      daily: 5000,
      monthly: 20000,
    },
    restrictions: {
      allowedCategories: ['food', 'travel', 'accommodation', 'transportation', 'software'],
      allowTravel: true,
    },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'card-3',
    cardNumber: '4532 3456 7890 1234',
    cardholderName: 'Team Member',
    expiryDate: '10/25',
    cvv: '789',
    balance: 2000,
    status: 'active',
    userId: '3',
    userName: 'Team Member',
    limits: {
      perTransaction: 500,
      daily: 1000,
      monthly: 5000,
    },
    restrictions: {
      allowedCategories: ['food', 'office_supplies'],
      allowTravel: false,
    },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    cardId: 'card-1',
    amount: 45.99,
    currency: 'USD',
    merchant: 'Starbucks',
    category: 'food',
    description: 'Coffee and breakfast',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-2',
    cardId: 'card-2',
    amount: 1250.00,
    currency: 'USD',
    merchant: 'Delta Airlines',
    category: 'travel',
    description: 'Flight to NYC',
    status: 'completed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-3',
    cardId: 'card-1',
    amount: 89.99,
    currency: 'USD',
    merchant: 'GitHub',
    category: 'software',
    description: 'Monthly subscription',
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-4',
    cardId: 'card-3',
    amount: 32.50,
    currency: 'USD',
    merchant: 'Office Depot',
    category: 'office_supplies',
    description: 'Pens and notepads',
    status: 'completed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-5',
    cardId: 'card-2',
    amount: 350.00,
    currency: 'USD',
    merchant: 'Hilton Hotels',
    category: 'accommodation',
    description: 'Hotel stay',
    status: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-6',
    cardId: 'card-1',
    amount: 125.00,
    currency: 'USD',
    merchant: 'Uber',
    category: 'transportation',
    description: 'Airport transfer',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
]

// Mock Approval Requests
export const MOCK_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: 'apr-1',
    type: 'card_creation',
    requestedBy: '3',
    requestedByName: 'Team Member',
    status: 'pending',
    data: {
      cardholderName: 'New Employee',
      limits: {
        perTransaction: 500,
        daily: 1000,
        monthly: 5000,
      },
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'apr-2',
    type: 'limit_increase',
    requestedBy: '3',
    requestedByName: 'Team Member',
    status: 'approved',
    data: {
      cardId: 'card-3',
      newLimits: {
        monthly: 7500,
      },
    },
    approvedBy: '1',
    approvedByName: 'Admin User',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: '1',
    type: 'approval',
    title: 'New approval request',
    message: 'Team Member requested a new card',
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    userId: '1',
    type: 'transaction',
    title: 'Large transaction',
    message: 'Transaction of $1,250.00 at Delta Airlines',
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    userId: '2',
    type: 'limit_warning',
    title: 'Limit warning',
    message: 'You have reached 80% of your monthly limit',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'cardflow_users',
  CARDS: 'cardflow_cards',
  TRANSACTIONS: 'cardflow_transactions',
  APPROVALS: 'cardflow_approvals',
  NOTIFICATIONS: 'cardflow_notifications',
}

// Initialize localStorage with mock data
export function initializeMockData() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CARDS)) {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(MOCK_CARDS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(MOCK_TRANSACTIONS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPROVALS)) {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(MOCK_APPROVAL_REQUESTS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS))
  }
}

// Mock API functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token: `mock-token-${user.id}`,
    }
  },

  // Dashboard
  getDashboardStats: async (userId: string): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const cards = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS) || '[]')
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')
    const approvals = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPROVALS) || '[]')

    const userCards = cards.filter((c: Card) => c.userId === userId)
    const activeCards = userCards.filter((c: Card) => c.status === 'active')

    const totalSpend = transactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0)
    const monthStart = new Date()
    monthStart.setDate(1)
    const monthlySpend = transactions
      .filter((t: Transaction) => new Date(t.createdAt) >= monthStart)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

    const pendingApprovals = approvals.filter((a: ApprovalRequest) => a.status === 'pending').length
    const recentTransactions = transactions.slice(0, 5)

    return {
      totalCards: cards.length,
      activeCards: activeCards.length,
      totalSpend,
      monthlySpend,
      pendingApprovals,
      recentTransactions,
    }
  },

  // Cards
  getCards: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS) || '[]')
  },

  createCard: async (cardData: Partial<Card>) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const cards = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS) || '[]')
    const newCard: Card = {
      id: `card-${Date.now()}`,
      cardNumber: generateCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      balance: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...cardData,
    } as Card

    cards.push(newCard)
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards))
    return newCard
  },

  updateCard: async (cardId: string, updates: Partial<Card>) => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const cards = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS) || '[]')
    const index = cards.findIndex((c: Card) => c.id === cardId)

    if (index === -1) throw new Error('Card not found')

    cards[index] = { ...cards[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards))
    return cards[index]
  },

  freezeCard: async (cardId: string) => {
    return mockApi.updateCard(cardId, { status: 'frozen' })
  },

  unfreezeCard: async (cardId: string) => {
    return mockApi.updateCard(cardId, { status: 'active' })
  },

  // Transactions
  getTransactions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')
  },

  createTransaction: async (txData: Partial<Transaction>) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
      ...txData,
    } as Transaction

    transactions.unshift(newTransaction)
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    return newTransaction
  },

  // Approvals
  getApprovals: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPROVALS) || '[]')
  },

  updateApproval: async (approvalId: string, status: 'approved' | 'rejected', approverId: string, approverName: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const approvals = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPROVALS) || '[]')
    const index = approvals.findIndex((a: ApprovalRequest) => a.id === approvalId)

    if (index === -1) throw new Error('Approval not found')

    approvals[index] = {
      ...approvals[index],
      status,
      approvedBy: approverId,
      approvedByName: approverName,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals))
    return approvals[index]
  },

  // Notifications
  getNotifications: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]')
    return notifications.filter((n: Notification) => n.userId === userId)
  },

  markNotificationRead: async (notificationId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200))

    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]')
    const index = notifications.findIndex((n: Notification) => n.id === notificationId)

    if (index !== -1) {
      notifications[index].read = true
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
    }
  },

  // Team Management
  getTeamMembers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    return users.map((u: any) => {
      const { password, ...userWithoutPassword } = u
      return userWithoutPassword
    })
  },

  inviteTeamMember: async (memberData: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    const newUser: User = {
      id: `user-${Date.now()}`,
      companyId: 'company-1',
      createdAt: new Date().toISOString(),
      password: 'Welcome123!',
      ...memberData,
    } as User

    users.push(newUser)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  updateTeamMember: async (userId: string, updates: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    const index = users.findIndex((u: User) => u.id === userId)

    if (index === -1) throw new Error('User not found')

    users[index] = { ...users[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    const { password, ...userWithoutPassword } = users[index]
    return userWithoutPassword
  },

  deleteTeamMember: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    const filtered = users.filter((u: User) => u.id !== userId)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered))
  },

  // Analytics
  getSpendingByCategory: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')

    const categoryTotals: Record<string, number> = {}
    transactions.forEach((t: Transaction) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }))
  },

  getSpendingTrend: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')

    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('default', { month: 'short' })
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthTotal = transactions
        .filter((t: Transaction) => {
          const txDate = new Date(t.createdAt)
          return txDate >= monthStart && txDate <= monthEnd
        })
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

      last6Months.push({ month, amount: monthTotal })
    }

    return last6Months
  },
}

// Helper functions
function generateCardNumber(): string {
  const parts = []
  for (let i = 0; i < 4; i++) {
    parts.push(Math.floor(1000 + Math.random() * 9000))
  }
  return parts.join(' ')
}

function generateExpiryDate(): string {
  const month = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0')
  const year = (new Date().getFullYear() + 2).toString().slice(-2)
  return `${month}/${year}`
}

function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString()
}
