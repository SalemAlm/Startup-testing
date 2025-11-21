import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, Transaction, Notification } from '@/types'
import { mockApi, initializeMockData } from '@/services/mockData'

// Pages
import MobileLogin from './pages/MobileLogin'
import MobileHome from './pages/MobileHome'
import MobileMyCards from './pages/MobileMyCards'
import MobileCardDetails from './pages/MobileCardDetails'
import MobileCardRequest from './pages/MobileCardRequest'
import MobileTransactions from './pages/MobileTransactions'
import MobileNotifications from './pages/MobileNotifications'
import MobileAnalytics from './pages/MobileAnalytics'
import MobileProfile from './pages/MobileProfile'

// Components
import MobileNav, { MobileScreen } from './components/MobileNav'
import ReceiptUpload from './components/ReceiptUpload'
import BalanceTopUpModal from './components/BalanceTopUpModal'
import { Toaster } from 'react-hot-toast'

export default function MobileApp() {
  const { user, logout } = useAuthStore()
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>('home')
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showReceiptUpload, setShowReceiptUpload] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showCardRequest, setShowCardRequest] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    initializeMockData()
  }, [])

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      const data = await mockApi.getNotifications(user?.id || '')
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const handleLoginSuccess = () => {
    setCurrentScreen('home')
  }

  const handleLogout = () => {
    logout()
    setCurrentScreen('home')
  }

  const handleCardClick = (card: Card) => {
    setSelectedCard(card)
  }

  const handleCardBack = () => {
    setSelectedCard(null)
    setCurrentScreen('cards')
  }

  const handleCardUpdated = () => {
    setSelectedCard(null)
    setCurrentScreen('cards')
  }

  const handleRequestCard = () => {
    setShowCardRequest(true)
  }

  const handleCardRequestSuccess = () => {
    setShowCardRequest(false)
    setCurrentScreen('cards')
  }

  const handleUploadReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowReceiptUpload(true)
  }

  const handleReceiptUploadSuccess = () => {
    setShowReceiptUpload(false)
    setSelectedTransaction(null)
    setCurrentScreen('transactions')
  }

  const handleRequestTopUp = (card: Card) => {
    setSelectedCard(card)
    setShowTopUpModal(true)
  }

  const handleTopUpSuccess = () => {
    setShowTopUpModal(false)
    setSelectedCard(null)
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  // Show login if not authenticated
  if (!user) {
    return (
      <>
        <MobileLogin onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-center" />
      </>
    )
  }

  // Show card request if active
  if (showCardRequest) {
    return (
      <>
        <MobileCardRequest onBack={() => setShowCardRequest(false)} onSuccess={handleCardRequestSuccess} />
        <Toaster position="top-center" />
      </>
    )
  }

  // Show card details if a card is selected
  if (selectedCard && !showTopUpModal) {
    return (
      <>
        <MobileCardDetails
          card={selectedCard}
          onBack={handleCardBack}
          onCardUpdated={handleCardUpdated}
          onRequestTopUp={handleRequestTopUp}
        />
        <Toaster position="top-center" />
      </>
    )
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <MobileHome />
      case 'cards':
        return <MobileMyCards onCardClick={handleCardClick} onRequestCard={handleRequestCard} />
      case 'transactions':
        return <MobileTransactions onBack={() => setCurrentScreen('home')} onUploadReceipt={handleUploadReceipt} />
      case 'analytics':
        return <MobileAnalytics onBack={() => setCurrentScreen('home')} />
      case 'profile':
        return <MobileProfile onBack={() => setCurrentScreen('home')} onLogout={handleLogout} />
      default:
        return <MobileHome />
    }
  }

  return (
    <>
      {renderScreen()}
      <MobileNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        unreadNotifications={unreadNotifications}
      />

      {/* Modals */}
      {showReceiptUpload && selectedTransaction && (
        <ReceiptUpload
          transaction={selectedTransaction}
          onClose={() => setShowReceiptUpload(false)}
          onSuccess={handleReceiptUploadSuccess}
        />
      )}

      {showTopUpModal && selectedCard && (
        <BalanceTopUpModal
          card={selectedCard}
          onClose={() => setShowTopUpModal(false)}
          onSuccess={handleTopUpSuccess}
        />
      )}

      <Toaster position="top-center" />
    </>
  )
}
