# MyPlatform - Social Media + E-Commerce + Content Marketplace

Platform ya Kitanzania kwa wasanii na wabunifu kuuza content zao - Movies, Series, Comedy, Gospel, na Music.

## 🚀 Features

- **User Authentication** - Register, login, profile management
- **Content Marketplace** - Upload, browse, and purchase content
- **Selcom Payment Integration** - M-Pesa, Tigo Pesa, Airtel Money
- **Creator Dashboard** - Manage content, view earnings
- **Wallet System** - Balance tracking, withdrawals
- **Social Features** - Follow creators, view profiles
- **Commission System** - 15% platform fee on sales

## 📁 Project Structure

```
phidchat/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state management
│   │   └── types/           # TypeScript interfaces
│   └── ...
├── backend/                  # Node.js + Express backend
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Auth & validation
│   └── server.js            # Entry point
└── README.md
```

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- React Query (Data fetching)
- Zustand (State management)
- React Router (Navigation)
- Headless UI + Heroicons (UI components)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (Real-time)
- Selcom API (Payments)

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Selcom API credentials

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myplatform
JWT_SECRET=your_secret_key
APP_URL=http://localhost:3000
SELCOM_API_KEY=your_key
SELCOM_API_SECRET=your_secret
SELCOM_VENDOR_ID=your_vendor_id
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Content
- `GET /api/content` - List all content
- `GET /api/content/:id` - Get single content
- `POST /api/content` - Create content (creator)
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `GET /api/content/:id/access` - Check user access

### Payments
- `POST /api/payments/buy-content` - Purchase content
- `POST /api/payments/verification-payment` - Verify account
- `POST /api/payments/withdraw` - Request withdrawal
- `GET /api/payments/transactions` - Get transaction history
- `GET /api/payments/wallet` - Get wallet balance
- `POST /api/payments/webhook` - Selcom webhook

### Users
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/follow` - Follow/unfollow user

## 💰 Payment Flow

1. User selects content to purchase
2. Enters phone number for mobile money
3. System creates Selcom order
4. User redirected to Selcom payment page
5. User completes payment via M-Pesa/Tigo Pesa/Airtel
6. Selcom sends webhook confirmation
7. System grants content access
8. Creator receives 85% (after 15% commission)

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Webhook signature verification
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ Environment variable configuration

## 📱 Selcom Test Credentials

For testing, use Selcom's sandbox environment:
- Base URL: `https://apigw.selcommobile.com/test/v1`
- Test Cards:
  - Success: `5123450000000008`
  - Failure: `4000000000000002`

## 🚀 Deployment

### Brixly Hosting
1. Build frontend: `npm run build`
2. Upload files via FTP
3. Set up Node.js environment
4. Configure environment variables
5. Enable SSL certificate

### MongoDB Atlas
1. Create free cluster
2. Get connection string
3. Update `MONGODB_URI`

## 📞 Support

Kwa msaada zaidi:
- Email: support@myplatform.co.tz
- WhatsApp: +255 xxx xxx xxx

## 📄 License

MIT License - Feel free to use and modify.

---

Built with ❤️ for Tanzanian creators
