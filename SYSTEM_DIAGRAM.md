# 📊 SYSTEM DIAGRAM - Mchoro wa Mfumo

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                               │
│                      http://localhost:3000                           │
└────────────────┬────────────────────────────────┬────────────────────┘
                 │                                │
                 │ HTTP/REST API                  │ WebSocket
                 │ (axios)                        │ (Socket.IO)
                 │                                │
┌────────────────▼────────────────────────────────▼────────────────────┐
│                         FRONTEND LAYER                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  React 18 + TypeScript + Vite                                │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │   │
│  │  │   Pages    │  │ Components │  │   Store    │             │   │
│  │  │  (Routes)  │  │   (UI)     │  │ (Zustand)  │             │   │
│  │  └────────────┘  └────────────┘  └────────────┘             │   │
│  │                                                               │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │   │
│  │  │  API Layer │  │  Socket.IO │  │ TailwindCSS│             │   │
│  │  │  (axios)   │  │   Client   │  │  Styling   │             │   │
│  │  └────────────┘  └────────────┘  └────────────┘             │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────┘
                 │                                │
                 │ JSON/REST                      │ Socket Events
                 │                                │
┌────────────────▼────────────────────────────────▼────────────────────┐
│                         BACKEND LAYER                                 │
│                    http://localhost:5000                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Node.js + Express + Socket.IO                               │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │              MIDDLEWARE                              │    │   │
│  │  │  • CORS                                              │    │   │
│  │  │  • JWT Authentication                                │    │   │
│  │  │  • Body Parser                                       │    │   │
│  │  │  • Error Handler                                     │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │              API ROUTES                              │    │   │
│  │  │  /api/auth         - Authentication                  │    │   │
│  │  │  /api/posts        - Social Posts                    │    │   │
│  │  │  /api/comments     - Comments                        │    │   │
│  │  │  /api/messages     - Chat Messages                   │    │   │
│  │  │  /api/friends      - Friend System                   │    │   │
│  │  │  /api/notifications - Notifications                  │    │   │
│  │  │  /api/content      - Marketplace                     │    │   │
│  │  │  /api/payments     - Payments                        │    │   │
│  │  │  /api/users        - User Profiles                   │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │           SOCKET.IO EVENTS                           │    │   │
│  │  │  • user:online / friend:online                       │    │   │
│  │  │  • conversation:join / conversation:leave            │    │   │
│  │  │  • typing:start / typing:stop                        │    │   │
│  │  │  • message:send / message:new                        │    │   │
│  │  │  • notification:send / notification:new              │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │              SERVICES                                │    │   │
│  │  │  • Selcom Payment Gateway                            │    │   │
│  │  │  • Email Service (Nodemailer)                        │    │   │
│  │  │  • File Upload (Multer)                              │    │   │
│  │  │  • Cloudinary Integration                            │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────┘
                 │
                 │ Mongoose ODM
                 │
┌────────────────▼──────────────────────────────────────────────────────┐
│                         DATABASE LAYER                                 │
│                    MongoDB (Port 27017)                                │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Collections:                                                 │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │    │
│  │  │   users    │  │   posts    │  │  comments  │             │    │
│  │  │  (auth,    │  │  (social   │  │  (post     │             │    │
│  │  │  profile)  │  │   feed)    │  │  replies)  │             │    │
│  │  └────────────┘  └────────────┘  └────────────┘             │    │
│  │                                                               │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │    │
│  │  │  messages  │  │conversations│ │notifications│             │    │
│  │  │  (chat     │  │  (chat     │  │  (alerts)  │             │    │
│  │  │  content)  │  │  threads)  │  │            │             │    │
│  │  └────────────┘  └────────────┘  └────────────┘             │    │
│  │                                                               │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │    │
│  │  │  contents  │  │transactions│  │usercontents│             │    │
│  │  │ (marketplace│ │ (payments) │  │ (purchases)│             │    │
│  │  │   videos)  │  │            │  │            │             │    │
│  │  └────────────┘  └────────────┘  └────────────┘             │    │
│  └──────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Examples

### 1. User Registration Flow
```
User fills form
    ↓
Frontend validates input
    ↓
POST /api/auth/register
    ↓
Backend validates data
    ↓
Hash password (bcrypt)
    ↓
Save to MongoDB users collection
    ↓
Generate JWT token
    ↓
Return { token, user }
    ↓
Frontend stores token
    ↓
Redirect to dashboard
```

### 2. Real-Time Chat Flow
```
User A types message
    ↓
socket.emit('typing:start')
    ↓
Server broadcasts to User B
    ↓
User B sees "User A is typing..."
    ↓
User A sends message
    ↓
POST /api/messages/conversations/:id/messages
    ↓
Save to MongoDB messages collection
    ↓
socket.emit('message:send')
    ↓
Server broadcasts to conversation room
    ↓
User B receives via 'message:new'
    ↓
Message appears in User B's chat
```

### 3. Content Purchase Flow
```
User clicks "Buy Content"
    ↓
POST /api/payments/buy-content
    ↓
Create Selcom order
    ↓
Save transaction (status: pending)
    ↓
Return payment URL
    ↓
Redirect to Selcom
    ↓
User pays via M-Pesa
    ↓
Selcom webhook → POST /api/payments/webhook
    ↓
Verify webhook signature
    ↓
Update transaction (status: completed)
    ↓
Create UserContent record (grant access)
    ↓
Update creator wallet (+85%)
    ↓
Update platform earnings (+15%)
    ↓
Send notifications
    ↓
User can now watch content
```

### 4. Social Post Flow
```
User creates post
    ↓
POST /api/posts
    ↓
Save to MongoDB posts collection
    ↓
Return post data
    ↓
Post appears in newsfeed
    ↓
Friend likes post
    ↓
POST /api/posts/:id/like
    ↓
Update post likes array
    ↓
Create notification
    ↓
socket.emit('notification:send')
    ↓
User receives notification
    ↓
"Friend liked your post"
```

## 🔐 Authentication Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Authentication Flow                     │
└─────────────────────────────────────────────────────────┘

1. Login Request
   ┌──────────┐
   │  Client  │ POST /api/auth/login
   │          │ { email, password }
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │  Server  │ Verify credentials
   │          │ bcrypt.compare(password, hash)
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │   JWT    │ jwt.sign({ userId, email })
   │  Token   │ Secret: JWT_SECRET
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │  Client  │ Store token in localStorage
   │          │ or sessionStorage
   └──────────┘

2. Protected Request
   ┌──────────┐
   │  Client  │ GET /api/posts/feed
   │          │ Header: Authorization: Bearer <token>
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │Middleware│ jwt.verify(token, JWT_SECRET)
   │  (auth)  │ Extract userId
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │  Route   │ req.user = { userId, email }
   │ Handler  │ Access user data
   └──────────┘
```

## 💬 Socket.IO Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Socket.IO Connection Flow                   │
└─────────────────────────────────────────────────────────┘

Client Side:
┌──────────────────────────────────────────┐
│  import { io } from 'socket.io-client'   │
│  const socket = io('http://localhost:5000')│
│                                          │
│  socket.on('connect', () => {           │
│    socket.emit('user:online', userId)   │
│  })                                      │
└──────────────────────────────────────────┘
        │
        │ WebSocket Connection
        ▼
Server Side:
┌──────────────────────────────────────────┐
│  io.on('connection', (socket) => {       │
│    socket.on('user:online', (userId) => {│
│      socket.join(`user:${userId}`)       │
│      // Update user status              │
│      // Notify friends                  │
│    })                                    │
│  })                                      │
└──────────────────────────────────────────┘

Event Flow:
┌─────────┐         ┌─────────┐         ┌─────────┐
│ User A  │────────▶│ Server  │────────▶│ User B  │
│ (emit)  │         │(broadcast)│        │(receive)│
└─────────┘         └─────────┘         └─────────┘
```

## 📦 Package Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Core Framework:                                         │
│  ├── express          (Web server)                      │
│  ├── mongoose         (MongoDB ODM)                     │
│  └── dotenv           (Environment config)              │
│                                                          │
│  Authentication:                                         │
│  ├── jsonwebtoken     (JWT tokens)                      │
│  ├── bcryptjs         (Password hashing)                │
│  └── express-validator (Input validation)               │
│                                                          │
│  Real-Time:                                              │
│  └── socket.io        (WebSocket)                       │
│                                                          │
│  File Handling:                                          │
│  ├── multer           (File uploads)                    │
│  └── cloudinary       (Cloud storage)                   │
│                                                          │
│  Payments:                                               │
│  └── axios            (HTTP client for Selcom API)      │
│                                                          │
│  Utilities:                                              │
│  ├── cors             (CORS middleware)                 │
│  └── nodemailer       (Email sending)                   │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Core Framework:                                         │
│  ├── react            (UI library)                      │
│  ├── typescript       (Type safety)                     │
│  └── vite             (Build tool)                      │
│                                                          │
│  Routing & State:                                        │
│  ├── react-router-dom (Navigation)                      │
│  └── zustand          (State management)                │
│                                                          │
│  Data Fetching:                                          │
│  ├── axios            (HTTP client)                     │
│  └── @tanstack/react-query (Data caching)               │
│                                                          │
│  Real-Time:                                              │
│  └── socket.io-client (WebSocket client)                │
│                                                          │
│  UI Components:                                          │
│  ├── tailwindcss      (CSS framework)                   │
│  ├── @headlessui/react (UI components)                  │
│  └── @heroicons/react (Icons)                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🗄️ Database Schema Relationships

```
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Collections                     │
└─────────────────────────────────────────────────────────┘

        ┌──────────┐
        │  users   │ (Central collection)
        └────┬─────┘
             │
    ┌────────┼────────┬────────┬────────┬────────┐
    │        │        │        │        │        │
    ▼        ▼        ▼        ▼        ▼        ▼
┌───────┐┌───────┐┌───────┐┌───────┐┌───────┐┌───────┐
│ posts ││comments││messages││friends││content││notifs │
└───────┘└───────┘└───────┘└───────┘└───────┘└───────┘
    │        │        │                  │
    │        │        │                  │
    ▼        ▼        ▼                  ▼
┌───────┐┌───────┐┌───────┐        ┌───────────┐
│ likes ││replies││convos │        │transactions│
└───────┘└───────┘└───────┘        └─────┬─────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │ usercontents │
                                   │ (purchases)  │
                                   └──────────────┘

Relationships:
• User → Posts (one-to-many)
• User → Comments (one-to-many)
• User → Messages (one-to-many)
• User ↔ User (friends, many-to-many)
• User → Content (creator, one-to-many)
• User → Transactions (one-to-many)
• Content → UserContent (purchases, one-to-many)
• Post → Comments (one-to-many)
• Message → Conversation (many-to-one)
```

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Stack                        │
└─────────────────────────────────────────────────────────┘

Layer 1: Network
├── CORS (Cross-Origin Resource Sharing)
└── HTTPS (SSL/TLS in production)

Layer 2: Authentication
├── JWT Token (stateless auth)
├── Password Hashing (bcrypt, 10 rounds)
└── Token Expiration (configurable)

Layer 3: Authorization
├── Middleware checks (auth.js)
├── Role-based access (user, creator, admin)
└── Resource ownership validation

Layer 4: Input Validation
├── express-validator
├── Schema validation (Mongoose)
└── Sanitization

Layer 5: Payment Security
├── Webhook signature verification
├── Selcom API authentication
└── Transaction status tracking

Layer 6: Data Protection
├── Environment variables (.env)
├── Sensitive data encryption
└── No credentials in code
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Production Setup                        │
└─────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │    USERS     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     CDN      │ (Cloudflare/Bunny.net)
                    │  Static Files│
                    └──────┬───────┘
                           │
                           ▼
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────┐                    ┌───────────────┐
│   Frontend    │                    │    Backend    │
│ (Netlify/     │                    │   (Brixly/    │
│  Vercel)      │                    │    VPS)       │
│               │                    │               │
│ React Build   │◄──────API──────────│ Node.js       │
│ (Static)      │       Calls        │ + Express     │
└───────────────┘                    └───────┬───────┘
                                             │
                                             ▼
                                    ┌────────────────┐
                                    │  MongoDB Atlas │
                                    │   (Database)   │
                                    └────────────────┘
                                             │
                                             ▼
                                    ┌────────────────┐
                                    │  Bunny.net     │
                                    │ (Video CDN)    │
                                    └────────────────┘
```

## 📊 Performance Optimization

```
Frontend:
├── Code Splitting (React.lazy)
├── Image Optimization (WebP)
├── Caching (React Query)
└── Lazy Loading (Intersection Observer)

Backend:
├── Database Indexing (MongoDB)
├── Query Optimization (Mongoose)
├── Caching (Redis - optional)
└── Connection Pooling

Real-Time:
├── Socket.IO Rooms (targeted broadcasting)
├── Event Throttling (typing indicators)
└── Connection Management

Media:
├── CDN Delivery (Bunny.net)
├── Video Transcoding
├── Adaptive Bitrate Streaming
└── Signed URLs (security)
```

---

**Mfumo wako ni kamili! (Your system is complete!)** 🎉

Kila sehemu inafanya kazi pamoja:
- Frontend → Backend (REST API)
- Backend → Database (MongoDB)
- Real-time → Socket.IO
- Payments → Selcom
- Videos → Local (ready for Bunny.net)

**Anza majaribio sasa! (Start testing now!)** 🚀
