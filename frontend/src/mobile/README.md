# CardFlow Mobile App - Cardholder Interface

A comprehensive mobile application for cardholders to manage their corporate cards, track spending, and request new cards.

## Features

### 🏠 Home Dashboard
- View total balance across all cards
- See active card count
- Track monthly spending
- View recent transactions
- Quick actions (Request Card, Top Up)

### 💳 My Cards
- View all your cards in one place
- Search and filter cards (all, active, frozen)
- Tap any card to view details
- Request new cards with one tap

### 📱 Card Details
- View complete card information (number, CVV, expiry)
- Copy card details to clipboard
- Show/hide sensitive information
- Check spending limits
- Add card to Apple Pay
- Freeze/unfreeze cards instantly
- Request balance top-ups

### 🎫 Card Request
- Request new cards with custom limits
- Assign cards to specific projects
- Set spending limits (per transaction, daily, monthly)
- Select allowed expense categories
- Enable/disable travel expenses
- Provide reason for request
- Admin approval workflow

### 📊 Transactions
- View all transaction history
- Search transactions by merchant or description
- Filter by category
- Upload receipts for completed transactions
- See transaction status (completed, pending, declined)
- View which card was used

### 📸 Receipt Upload
- Upload photos from device
- Attach receipts to transactions
- Maximum file size: 5MB
- Image preview before upload

### 🔔 Notifications
- Get notified about card approvals
- Transaction alerts
- Spending limit warnings
- Card status changes
- Mark notifications as read

### 📈 Analytics
- View total spending across all time
- See monthly spending trends (last 3 months)
- Breakdown by category with percentages
- Visual charts and graphs

### 👤 Profile
- View personal information
- See role and permissions
- Account details
- App version information
- Secure logout

## User Roles

### Member
- View own cards only
- Request new cards (requires approval)
- Request balance top-ups (requires approval)
- Upload receipts
- Freeze/unfreeze own cards
- View own transactions and analytics

### Finance
- All member permissions
- Can approve card requests
- Can approve balance top-ups
- View all cards

### Admin
- All permissions
- Full control over cards and users

## Workflow

### Card Request Process
1. **User** submits card request with:
   - Project name
   - Requested limits
   - Allowed categories
   - Reason for request

2. **Admin/Finance** receives notification of new request

3. **Admin/Finance** reviews and approves/rejects request

4. **User** receives notification of approval

5. **Card** is created and available immediately

### Balance Top-Up Process
1. **User** requests top-up from card details
2. **Admin/Finance** receives notification
3. **Admin/Finance** approves/rejects request
4. **User** receives notification
5. **Balance** is added if approved

## Demo Credentials

```
Member Account:
Email: member@company.com
Password: member123

Finance Account:
Email: finance@company.com
Password: finance123

Admin Account:
Email: admin@company.com
Password: admin123
```

## Tech Stack

- **React** with TypeScript
- **TailwindCSS** for styling
- **Zustand** for state management
- **React Hot Toast** for notifications
- **Lucide React** for icons

## File Structure

```
mobile/
├── MobileApp.tsx                 # Main app router
├── pages/
│   ├── MobileLogin.tsx          # Authentication
│   ├── MobileHome.tsx           # Dashboard
│   ├── MobileMyCards.tsx        # Card list
│   ├── MobileCardDetails.tsx    # Card details with actions
│   ├── MobileCardRequest.tsx    # Request new card
│   ├── MobileTransactions.tsx   # Transaction history
│   ├── MobileNotifications.tsx  # Notifications center
│   ├── MobileAnalytics.tsx      # Spending insights
│   └── MobileProfile.tsx        # User profile
└── components/
    ├── MobileNav.tsx            # Bottom navigation
    ├── MobileCard.tsx           # Card display component
    ├── ReceiptUpload.tsx        # Receipt upload modal
    └── BalanceTopUpModal.tsx    # Top-up request modal
```

## Usage

### Running the Mobile App

To use the mobile app, import and render the `MobileApp` component:

```tsx
import MobileApp from '@/mobile/MobileApp'

function App() {
  return <MobileApp />
}
```

### Navigation

The app uses a bottom navigation bar with 5 main sections:
- **Home**: Dashboard and overview
- **Cards**: Card management
- **Activity**: Transactions
- **Insights**: Analytics
- **Profile**: User settings

### Adding to Apple Pay

1. Navigate to Card Details
2. Tap "Add to Apple Pay"
3. Card is added to Apple Wallet
4. Use Apple Pay for contactless payments

*Note: In a production environment, this would integrate with actual Apple Pay APIs*

## Future Enhancements

- [ ] Biometric authentication (Face ID, Touch ID)
- [ ] Push notification integration
- [ ] Real-time transaction alerts
- [ ] Spending budgets and alerts
- [ ] Export transactions to CSV/PDF
- [ ] Multi-currency support
- [ ] Dark/Light theme toggle
- [ ] Offline mode support

## Security

- Passwords are hashed in production
- Sensitive card data is masked by default
- Session tokens expire after inactivity
- All API calls are authenticated
- Receipt uploads are validated and sanitized

## Support

For issues or feature requests, please contact your administrator.
