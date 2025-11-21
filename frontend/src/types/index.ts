export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'finance' | 'member'
  companyId: string
  createdAt: string
}

export interface Card {
  id: string
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cvv: string
  balance: number
  status: 'active' | 'frozen' | 'cancelled'
  userId: string
  userName: string
  limits: CardLimits
  restrictions: CardRestrictions
  createdAt: string
  lastUsed?: string
}

export interface CardLimits {
  perTransaction?: number
  daily?: number
  weekly?: number
  monthly?: number
  total?: number
}

export interface CardRestrictions {
  allowedCategories: TransactionCategory[]
  allowTravel: boolean
}

export type TransactionCategory =
  | 'food'
  | 'travel'
  | 'accommodation'
  | 'transportation'
  | 'utilities'
  | 'office_supplies'
  | 'software'
  | 'entertainment'
  | 'healthcare'
  | 'other'

export interface Transaction {
  id: string
  cardId: string
  amount: number
  currency: string
  merchant: string
  category: TransactionCategory
  description: string
  status: 'pending' | 'completed' | 'declined'
  receiptId?: string
  createdAt: string
}

export interface Receipt {
  id: string
  transactionId: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
}

export interface ApprovalRequest {
  id: string
  type: 'card_creation' | 'limit_increase' | 'expense'
  requestedBy: string
  requestedByName: string
  status: 'pending' | 'approved' | 'rejected'
  data: any
  reason?: string
  approvedBy?: string
  approvedByName?: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'transaction' | 'approval' | 'limit_warning' | 'card_status'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface DashboardStats {
  totalCards: number
  activeCards: number
  totalSpend: number
  monthlySpend: number
  pendingApprovals: number
  recentTransactions: Transaction[]
}
