# 🏗️ ARCHITECTURE YA PLATFORM - Maelezo Kamili

## 📊 Muundo wa Jumla (Complete Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + TypeScript + Vite + TailwindCSS + Socket.IO       │
│                    (Port 3000)                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP/REST API + WebSocket
                 │
┌────────────────▼────────────────────────────────────────────┐
│                        BACKEND                               │
│    Node.js + Express + Socket.IO + JWT Auth                │
│                    (Port 5000)                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Mongoose ODM
                 │
┌────────────────▼────────────────────────────────────────────┐
│                       DATABASE                               │
│              MongoDB (Local/Atlas)                          │
│            mongodb://localhost:27017                        │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Features Zilizopo (Existing Features)

### ✅ 1. Authentication & Authorization
- **JWT Token-based auth**
- Register (email + password)
- Login (email + password)
- Profile management
- Password hashing (bcrypt)
- Protected routes middleware

**Files:**
- `backend/routes/auth.js` - Auth endpoints
- `backend/models/User.js` - User schema
- `backend/middleware/auth.js` - JWT verification

### ✅ 2. Real-Time Chat (Socket.IO)
- One-on-one messaging
- Conversation management
- Typing indicators
- Read receipts
- Online/offline status
- Message history

**Socket Events:**
```javascript
// Client → Server
'user:online'           // User comes online
'conversation:join'     // Join chat room
'typing:start'          // User typing
'message:send'          // Send message

// Server → Client
'friend:online'         // Friend online
'message:new'           // New message
'typing:start'          // Someone typing
'notification:new'      // New notification
```

**Files:**
- `backend/server.js` (lines 56-135) - Socket.IO setup
- `backend/routes/messages.js` - Message API
- `backend/models/Message.js` - Message schema
- `backend/models/Conversation.js` - Conversation schema

### ✅ 3. Social Features
- **Posts & Newsfeed**
  - Create, edit, delete posts
  - Like/react to posts
  - Comment system with replies
  - Share posts
  - Hashtags & mentions

- **Friends System**
  - Send/accept/decline friend requests
  - Friends list
  - Block/unblock users
  - Friend suggestions

- **Notifications**
  - Real-time notifications
  - Friend requests, likes, comments
  - Unread count

**Files:**
- `backend/routes/posts.js` - Post management
- `backend/routes/comments.js` - Comments
- `backend/routes/friends.js` - Friend system
- `backend/routes/notifications.js` - Notifications
- `backend/models/Post.js` - Post schema
- `backend/models/Comment.js` - Comment schema
- `backend/models/Notification.js` - Notification schema

### ✅ 4. Content Marketplace
- Upload content (videos, movies, series)
- Browse content catalog
- Purchase content
- Access control
- Creator dashboard
- Earnings tracking

**Files:**
- `backend/routes/content.js` - Content management
- `backend/models/Content.js` - Content schema
- `backend/models/UserContent.js` - User purchases

### ✅ 5. Payment System
- Selcom payment gateway integration
- M-Pesa, Tigo Pesa, Airtel Money
- Wallet system
- Transaction history
- Withdrawal requests
- 15% platform commission

**Files:**
- `backend/routes/payments.js` - Payment endpoints
- `backend/models/Transaction.js` - Transaction schema
- `backend/services/selcom.js` - Selcom API integration

### ✅ 6. Video System (Ready for Bunny.net)
- Local video upload (current)
- Video metadata storage
- Access control per user
- Ready to integrate Bunny.net

**Current Setup:**
```javascript
// Local video serving
<video controls>
  <source src="/uploads/video.mp4" />
</video>

// After Bunny.net integration:
<video controls>
  <source src="https://video.bunny.net/play/{video-id}" />
</video>
```

## 📁 Folder Structure (Detailed)

```
phidchat/
│
├── backend/
│   ├── models/                    # MongoDB Schemas
│   │   ├── User.js               # User model (auth, profile, wallet)
│   │   ├── Post.js               # Social posts
│   │   ├── Comment.js            # Post comments
│   │   ├── Message.js            # Chat messages
│   │   ├── Conversation.js       # Chat conversations
│   │   ├── Notification.js       # User notifications
│   │   ├── Content.js            # Marketplace content
│   │   ├── Transaction.js        # Payment transactions
│   │   ├── UserContent.js        # User purchases
│   │   └── Story.js              # Stories (24hr posts)
│   │
│   ├── routes/                    # API Endpoints
│   │   ├── auth.js               # /api/auth/*
│   │   ├── posts.js              # /api/posts/*
│   │   ├── comments.js           # /api/comments/*
│   │   ├── messages.js           # /api/messages/*
│   │   ├── friends.js            # /api/friends/*
│   │   ├── notifications.js      # /api/notifications/*
│   │   ├── content.js            # /api/content/*
│   │   ├── payments.js           # /api/payments/*
│   │   └── users.js              # /api/users/*
│   │
│   ├── middleware/                # Express Middleware
│   │   └── auth.js               # JWT verification
│   │
│   ├── services/                  # Business Logic
│   │   └── selcom.js             # Payment gateway
│   │
│   ├── server.js                  # Main server + Socket.IO
│   ├── package.json              # Dependencies
│   ├── .env.example              # Environment template
│   └── config.env                # Your config (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # API client functions
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── store/                # Zustand state
│   │   ├── types/                # TypeScript types
│   │   ├── App.tsx               # Main app
│   │   └── main.tsx              # Entry point
│   │
│   ├── public/                    # Static files
│   ├── package.json              # Dependencies
│   ├── vite.config.ts            # Vite config
│   ├── tailwind.config.js        # Tailwind CSS
│   └── tsconfig.json             # TypeScript config
│
├── README.md                      # Project overview
├── SOCIAL_FEATURES.md            # Features documentation
└── ARCHITECTURE.md               # This file
```

## 🔌 API Endpoints (Complete List)

### Authentication (`/api/auth`)
```
POST   /register              - Create new account
POST   /login                 - Login user
GET    /me                    - Get current user
PUT    /profile               - Update profile
POST   /forgot-password       - Request password reset
POST   /reset-password        - Reset password
```

### Posts (`/api/posts`)
```
GET    /feed                  - Get newsfeed
GET    /:id                   - Get single post
POST   /                      - Create post
PUT    /:id                   - Update post
DELETE /:id                   - Delete post
POST   /:id/like              - Like/react to post
DELETE /:id/like              - Unlike post
POST   /:id/share             - Share post
GET    /user/:userId          - Get user's posts
```

### Comments (`/api/comments`)
```
GET    /post/:postId          - Get post comments
POST   /                      - Create comment
PUT    /:id                   - Update comment
DELETE /:id                   - Delete comment
POST   /:id/like              - Like comment
DELETE /:id/like              - Unlike comment
```

### Friends (`/api/friends`)
```
POST   /request/:userId       - Send friend request
POST   /accept/:userId        - Accept request
POST   /decline/:userId       - Decline request
DELETE /:userId               - Unfriend
GET    /                      - Get friends list
GET    /requests              - Get friend requests
GET    /suggestions           - Get suggestions
POST   /block/:userId         - Block user
DELETE /block/:userId         - Unblock user
```

### Messages (`/api/messages`)
```
GET    /conversations         - Get all conversations
POST   /conversations         - Create conversation
GET    /conversations/:id/messages  - Get messages
POST   /conversations/:id/messages  - Send message
DELETE /messages/:id          - Delete message
GET    /unread-count          - Get unread count
```

### Notifications (`/api/notifications`)
```
GET    /                      - Get notifications
PUT    /:id/read              - Mark as read
PUT    /read-all              - Mark all as read
DELETE /:id                   - Delete notification
GET    /unread-count          - Get unread count
```

### Content (`/api/content`)
```
GET    /                      - Browse content
GET    /:id                   - Get content details
POST   /                      - Upload content (creator)
PUT    /:id                   - Update content
DELETE /:id                   - Delete content
GET    /:id/access            - Check user access
```

### Payments (`/api/payments`)
```
POST   /buy-content           - Purchase content
POST   /verification-payment  - Verify account
POST   /withdraw              - Request withdrawal
GET    /transactions          - Transaction history
GET    /wallet                - Get wallet balance
POST   /webhook               - Selcom webhook
```

### Users (`/api/users`)
```
GET    /:id                   - Get user profile
POST   /:id/follow            - Follow/unfollow user
GET    /:id/followers         - Get followers
GET    /:id/following         - Get following
```

## 🔐 Authentication Flow

```
1. User Registration
   ↓
   POST /api/auth/register
   { email, password, name, phone }
   ↓
   Password hashed (bcrypt)
   ↓
   User saved to MongoDB
   ↓
   JWT token generated
   ↓
   Return { token, user }

2. User Login
   ↓
   POST /api/auth/login
   { email, password }
   ↓
   Verify password (bcrypt.compare)
   ↓
   JWT token generated
   ↓
   Return { token, user }

3. Protected Routes
   ↓
   Request with header:
   Authorization: Bearer <token>
   ↓
   Middleware verifies JWT
   ↓
   req.user = decoded user
   ↓
   Route handler executes
```

## 💬 Real-Time Chat Flow

```
1. User connects to Socket.IO
   ↓
   socket.emit('user:online', userId)
   ↓
   Server updates user status
   ↓
   Notify friends user is online

2. Start conversation
   ↓
   POST /api/messages/conversations
   { participantId }
   ↓
   Get or create conversation
   ↓
   socket.emit('conversation:join', conversationId)

3. Send message
   ↓
   User types → socket.emit('typing:start')
   ↓
   POST /api/messages/conversations/:id/messages
   { text }
   ↓
   Message saved to DB
   ↓
   socket.emit('message:send', message)
   ↓
   Server broadcasts to conversation room
   ↓
   Other users receive via 'message:new'

4. Read receipt
   ↓
   socket.emit('message:read', { messageId })
   ↓
   Update message status
   ↓
   Notify sender
```

## 💰 Payment Flow (Selcom)

```
1. User selects content
   ↓
   POST /api/payments/buy-content
   { contentId, phoneNumber }
   ↓
   Create Selcom order
   ↓
   Return payment URL
   ↓
   Redirect user to Selcom

2. User pays via M-Pesa/Tigo/Airtel
   ↓
   Selcom processes payment
   ↓
   POST /api/payments/webhook
   (Selcom sends confirmation)
   ↓
   Verify webhook signature
   ↓
   Update transaction status

3. Grant access
   ↓
   Create UserContent record
   ↓
   Update creator wallet (85%)
   ↓
   Update platform earnings (15%)
   ↓
   Send notification to user & creator
```

## 🎥 Video System Architecture

### Current (Local Storage)
```javascript
// Upload
multer → /uploads/videos/
         ↓
      Save path to DB
         ↓
    Serve via Express

// Playback
GET /uploads/videos/:filename
```

### Future (Bunny.net Integration)

```javascript
// Upload Flow
1. User uploads video
   ↓
2. Upload to Bunny.net Storage
   POST https://storage.bunnycdn.com/
   ↓
3. Save Bunny video ID to DB
   ↓
4. Video processed by Bunny

// Playback Flow
1. User requests video
   ↓
2. Check user access (paid?)
   ↓
3. Generate signed URL
   const signedUrl = generateBunnySignedUrl(videoId, userId, expiresIn)
   ↓
4. Return signed URL to frontend
   ↓
5. Frontend plays video
   <video src={signedUrl} />

// Security
- Signed URLs expire after X hours
- URL tied to specific user
- Cannot be shared
- Bunny.net validates signature
```

## 🔧 Technology Stack

### Backend Dependencies
```json
{
  "express": "^4.18.2",           // Web framework
  "mongoose": "^8.0.4",           // MongoDB ODM
  "socket.io": "^4.7.4",          // Real-time WebSocket
  "jsonwebtoken": "^9.0.2",       // JWT auth
  "bcryptjs": "^2.4.3",           // Password hashing
  "cors": "^2.8.5",               // CORS middleware
  "dotenv": "^16.3.1",            // Environment variables
  "multer": "^1.4.5-lts.1",       // File uploads
  "axios": "^1.13.2",             // HTTP client
  "cloudinary": "^1.41.0",        // Image/video hosting
  "express-validator": "^7.0.1",  // Input validation
  "nodemailer": "^6.9.8"          // Email sending
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",                    // UI library
  "react-router-dom": "^6.21.1",         // Routing
  "socket.io-client": "^4.8.3",          // WebSocket client
  "axios": "^1.6.5",                     // HTTP client
  "zustand": "^4.4.7",                   // State management
  "@tanstack/react-query": "^5.17.0",    // Data fetching
  "@headlessui/react": "^1.7.17",        // UI components
  "@heroicons/react": "^2.0.18",         // Icons
  "tailwindcss": "^3.4.1",               // CSS framework
  "typescript": "^5.3.3"                 // Type safety
}
```

## 🌐 Environment Variables

### Backend (config.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/myplatform

# JWT
JWT_SECRET=your_super_secret_key

# URLs
APP_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Selcom Payment
SELCOM_API_KEY=your_key
SELCOM_API_SECRET=your_secret
SELCOM_VENDOR_ID=your_vendor_id
SELCOM_BASE_URL=https://apigw.selcommobile.com/v1

# Cloudinary (Images/Videos)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────┐
│           Production Setup                   │
├─────────────────────────────────────────────┤
│                                              │
│  Frontend (Netlify/Vercel)                  │
│  - Build: npm run build                     │
│  - Deploy: dist/ folder                     │
│  - CDN: Global edge network                 │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Backend (Brixly/VPS)                       │
│  - Node.js server                           │
│  - PM2 process manager                      │
│  - Nginx reverse proxy                      │
│  - SSL certificate (Let's Encrypt)          │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Database (MongoDB Atlas)                   │
│  - Free tier: 512MB                         │
│  - Auto-backup                              │
│  - Global clusters                          │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Media Storage (Bunny.net)                  │
│  - Video streaming                          │
│  - CDN delivery                             │
│  - Signed URLs                              │
│                                              │
└─────────────────────────────────────────────┘
```

## 📊 Database Schema Overview

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  profilePicture: String,
  coverPhoto: String,
  bio: String,
  location: String,
  isOnline: Boolean,
  lastActive: Date,
  isCreator: Boolean,
  isVerified: Boolean,
  wallet: {
    balance: Number,
    pendingBalance: Number,
    totalEarnings: Number
  },
  friends: [{ user: ObjectId, status: String }],
  blockedUsers: [ObjectId],
  createdAt: Date
}
```

### Content Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String, // Movie, Series, Comedy, Gospel, Music
  price: Number,
  creator: ObjectId (ref: User),
  videoUrl: String,
  thumbnailUrl: String,
  duration: Number,
  views: Number,
  purchases: Number,
  tags: [String],
  status: String, // active, pending, removed
  createdAt: Date
}
```

### Transaction Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  type: String, // purchase, withdrawal, commission
  amount: Number,
  status: String, // pending, completed, failed
  content: ObjectId (ref: Content),
  paymentMethod: String,
  selcomOrderId: String,
  createdAt: Date
}
```

## 🎯 Next Steps (Bunny.net Integration)

### 1. Sign up for Bunny.net
- Create account at bunny.net
- Get API key
- Create storage zone
- Create video library

### 2. Install Bunny SDK
```bash
cd backend
npm install @bunny.net/sdk
```

### 3. Update Environment Variables
```env
BUNNY_API_KEY=your_api_key
BUNNY_STORAGE_ZONE=your_zone
BUNNY_VIDEO_LIBRARY_ID=your_library_id
BUNNY_CDN_HOSTNAME=your_cdn.b-cdn.net
```

### 4. Modify Upload Logic
```javascript
// backend/services/bunny.js
const uploadToBunny = async (file) => {
  // Upload to Bunny Storage
  // Return video ID
}

const generateSignedUrl = (videoId, userId, expiresIn) => {
  // Generate secure signed URL
  // Include user ID in token
  // Set expiration time
}
```

### 5. Update Content Model
```javascript
// Add Bunny fields
bunnyVideoId: String,
bunnyStreamUrl: String,
bunnyThumbnail: String
```

---

**Built with ❤️ for Tanzanian Creators**
