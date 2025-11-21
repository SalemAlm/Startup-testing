import { Home, CreditCard, Receipt, TrendingUp, User } from 'lucide-react'

export type MobileScreen =
  | 'home'
  | 'cards'
  | 'transactions'
  | 'analytics'
  | 'profile'

interface MobileNavProps {
  currentScreen: MobileScreen
  onNavigate: (screen: MobileScreen) => void
  unreadNotifications?: number
}

export default function MobileNav({ currentScreen, onNavigate, unreadNotifications = 0 }: MobileNavProps) {
  const navItems: { screen: MobileScreen; icon: React.ComponentType<any>; label: string }[] = [
    { screen: 'home', icon: Home, label: 'Home' },
    { screen: 'cards', icon: CreditCard, label: 'Cards' },
    { screen: 'transactions', icon: Receipt, label: 'Activity' },
    { screen: 'analytics', icon: TrendingUp, label: 'Insights' },
    { screen: 'profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-slate px-6 py-3 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map(({ screen, icon: Icon, label }) => {
          const isActive = currentScreen === screen
          return (
            <button
              key={screen}
              onClick={() => onNavigate(screen)}
              className="flex flex-col items-center gap-1 relative"
            >
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isActive ? 'bg-primary/20' : 'bg-transparent'
                }`}
              >
                <Icon
                  size={22}
                  className={`transition-colors ${
                    isActive ? 'text-primary' : 'text-gray-400'
                  }`}
                />
                {screen === 'profile' && unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
