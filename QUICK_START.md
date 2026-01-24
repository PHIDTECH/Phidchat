# ⚡ QUICK START - Anza Haraka!

## 🎯 Kwa Majaribio ya Haraka (5 Minutes)

### Step 1: Backend
```powershell
cd c:\xampp\htdocs\phidchat\backend
npm install
copy .env.example config.env
npm run dev
```

### Step 2: Frontend (Terminal Mpya)
```powershell
cd c:\xampp\htdocs\phidchat\frontend
npm install
echo VITE_API_URL=http://localhost:5000/api > .env
echo VITE_SOCKET_URL=http://localhost:5000 >> .env
npm run dev
```

### Step 3: Open Browser
http://localhost:3000

---

## ✅ Kile Kilichopo Tayari (Already Built)

### 1. **Authentication System** ✓
- Register/Login with JWT
- Password hashing (bcrypt)
- Protected routes
- Profile management

**Files:**
- `backend/routes/auth.js`
- `backend/models/User.js`
- `backend/middleware/auth.js`

### 2. **Real-Time Chat** ✓
- Socket.IO integration
- One-on-one messaging
- Typing indicators
- Online/offline status
- Read receipts

**Files:**
- `backend/server.js` (lines 56-135)
- `backend/routes/messages.js`
- `backend/models/Message.js`
- `backend/models/Conversation.js`

### 3. **Social Features** ✓
- Posts (create, like, comment, share)
- Friends system (add, accept, block)
- Notifications (real-time)
- Newsfeed algorithm

**Files:**
- `backend/routes/posts.js`
- `backend/routes/comments.js`
- `backend/routes/friends.js`
- `backend/routes/notifications.js`

### 4. **Content Marketplace** ✓
- Upload content (movies, series, music)
- Browse catalog
- Purchase system
- Access control
- Creator dashboard

**Files:**
- `backend/routes/content.js`
- `backend/models/Content.js`
- `backend/models/UserContent.js`

### 5. **Payment System** ✓
- Selcom integration
- M-Pesa, Tigo Pesa, Airtel Money
- Wallet system
- Transaction history
- 15% commission system

**Files:**
- `backend/routes/payments.js`
- `backend/services/selcom.js`
- `backend/models/Transaction.js`

### 6. **Video System** ✓
- Local video storage (current)
- Video metadata
- Access control
- **Ready for Bunny.net upgrade**

---

## 🔧 Mahitaji (Requirements)

### Software:
- ✅ Node.js 18+ → [Download](https://nodejs.org/)
- ✅ MongoDB → [Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)

### Packages (Auto-installed):
```json
Backend:
- express, mongoose, socket.io
- jsonwebtoken, bcryptjs
- cors, dotenv, multer

Frontend:
- react, typescript, vite
- socket.io-client, axios
- tailwindcss, zustand
```

---

## 📁 Project Structure

```
phidchat/
│
├── backend/                      # ✅ COMPLETE
│   ├── models/                   # 11 MongoDB schemas
│   ├── routes/                   # 9 API route files
│   ├── middleware/               # Auth middleware
│   ├── services/                 # Selcom payment service
│   ├── server.js                 # Main server + Socket.IO
│   └── package.json              # Dependencies
│
├── frontend/                     # ✅ COMPLETE
│   ├── src/
│   │   ├── api/                  # API client
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── store/                # State management
│   │   └── types/                # TypeScript types
│   └── package.json              # Dependencies
│
├── README.md                     # Project overview
├── ARCHITECTURE.md               # System architecture (NEW)
├── TESTING_GUIDE.md              # Testing instructions (NEW)
├── QUICK_START.md                # This file (NEW)
└── SOCIAL_FEATURES.md            # Features documentation
```

---

## 🚀 API Endpoints (Summary)

### Authentication
```
POST /api/auth/register    - Create account
POST /api/auth/login       - Login
GET  /api/auth/me          - Get current user
```

### Chat
```
GET  /api/messages/conversations              - Get all chats
POST /api/messages/conversations              - Create chat
GET  /api/messages/conversations/:id/messages - Get messages
POST /api/messages/conversations/:id/messages - Send message
```

### Social
```
GET  /api/posts/feed       - Get newsfeed
POST /api/posts            - Create post
POST /api/posts/:id/like   - Like post
POST /api/comments         - Add comment
POST /api/friends/request/:userId - Send friend request
```

### Content
```
GET  /api/content          - Browse content
POST /api/content          - Upload content (creator)
GET  /api/content/:id      - Get content details
```

### Payments
```
POST /api/payments/buy-content  - Purchase content
GET  /api/payments/wallet       - Get wallet balance
GET  /api/payments/transactions - Transaction history
```

---

## 💬 Socket.IO Events

### Client → Server
```javascript
socket.emit('user:online', userId);
socket.emit('conversation:join', conversationId);
socket.emit('typing:start', { conversationId });
socket.emit('message:send', messageData);
```

### Server → Client
```javascript
socket.on('friend:online', (friendId) => {});
socket.on('message:new', (message) => {});
socket.on('typing:start', (data) => {});
socket.on('notification:new', (notification) => {});
```

---

## 🧪 Test Commands

### Test Backend
```powershell
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"123456\"}"
```

### Test Frontend
```powershell
# Open browser
start http://localhost:3000

# Check console (F12)
# Should see: "Socket connected"
```

### Test Chat
1. Open two browser windows
2. Login as different users
3. Send messages
4. See real-time delivery

---

## 🎥 Video System

### Current (Local)
```javascript
// Upload
POST /api/content
{ videoUrl: "/uploads/videos/movie.mp4" }

// Play
<video src="http://localhost:5000/uploads/videos/movie.mp4" />
```

### Future (Bunny.net)
```javascript
// After integration
POST /api/content
{ bunnyVideoId: "abc123" }

// Play with signed URL
<video src={generateSignedUrl(videoId, userId)} />
```

**Bunny.net Integration Steps:**
1. ✅ Test local video playback first
2. ✅ Verify access control works
3. ✅ Test payment flow
4. 🔄 Then integrate Bunny.net
5. 🔄 Use signed URLs for security

---

## 🔐 Environment Variables

### Backend (config.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myplatform
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🐛 Common Issues

### Port Already in Use
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Not Running
```powershell
# Start MongoDB service
net start MongoDB
```

### Dependencies Not Installed
```powershell
# Backend
cd backend
rm -r node_modules
npm install

# Frontend
cd frontend
rm -r node_modules
npm install
```

---

## 📊 Database Collections

Your MongoDB will have:
- `users` - User accounts
- `posts` - Social posts
- `comments` - Post comments
- `messages` - Chat messages
- `conversations` - Chat conversations
- `notifications` - User notifications
- `contents` - Marketplace content
- `transactions` - Payment transactions
- `usercontents` - User purchases

---

## ✅ Verification Checklist

Before testing, verify:
- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (`net start | findstr MongoDB`)
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Frontend dependencies installed (`frontend/node_modules` exists)
- [ ] Environment files created (`config.env` and `.env`)
- [ ] Ports 5000 and 3000 are free

---

## 🎯 Testing Order

### 1. Backend First
```powershell
cd backend
npm run dev
# Wait for "MongoDB connected"
```

### 2. Frontend Second
```powershell
cd frontend
npm run dev
# Wait for "Local: http://localhost:3000"
```

### 3. Test Features
1. Register/Login ✓
2. Create post ✓
3. Send message ✓
4. Upload content ✓
5. Test payment (test mode) ✓

---

## 🚀 Next Steps

### Kwa Majaribio (Testing Phase)
1. ✅ Test authentication
2. ✅ Test chat system
3. ✅ Test social features
4. ✅ Test content upload
5. ✅ Test local video playback
6. ✅ Test payment flow (test mode)

### Baada ya Majaribio (After Testing)
1. 🔄 Integrate Bunny.net for videos
2. 🔄 Add production Selcom credentials
3. 🔄 Deploy to production
4. 🔄 Add custom domain
5. 🔄 Enable SSL certificate

---

## 📚 Documentation Files

- **README.md** - Project overview & installation
- **ARCHITECTURE.md** - Complete system architecture
- **TESTING_GUIDE.md** - Detailed testing instructions
- **SOCIAL_FEATURES.md** - Feature specifications
- **QUICK_START.md** - This file (quick reference)

---

## 💡 Key Points

### ✅ System is COMPLETE
- All features implemented
- Backend fully functional
- Frontend ready
- Database schemas created
- Socket.IO configured
- Payment integration ready

### 🎯 Focus on Testing
- Test each feature
- Verify real-time works
- Check video playback
- Test payment flow
- Ensure access control

### 🔄 Bunny.net is Optional (For Now)
- Local videos work fine for testing
- Integrate Bunny.net after testing
- Use signed URLs for security
- CDN for better performance

---

## 🎉 Kila Kitu Kiko Tayari!

Your platform has:
- ✅ Authentication (JWT)
- ✅ Real-time chat (Socket.IO)
- ✅ Social features (posts, friends)
- ✅ Content marketplace
- ✅ Payment system (Selcom)
- ✅ Video system (local, ready for Bunny.net)

**Just run the commands and start testing!** 🚀

---

**Questions?**
- Check `TESTING_GUIDE.md` for detailed steps
- Check `ARCHITECTURE.md` for system design
- Check `SOCIAL_FEATURES.md` for feature list

**Anza sasa! (Start now!)** 💪
