# 🧪 TESTING GUIDE - Majaribio ya Platform

## 📋 Orodha ya Mahitaji (Prerequisites)

### Software Unahitaji:
- ✅ Node.js 18+ (check: `node --version`)
- ✅ MongoDB (local au Atlas)
- ✅ Git (optional)
- ✅ Postman/Thunder Client (for API testing)

---

## 🚀 HATUA 1: Setup ya Backend

### 1.1 Navigate to Backend Folder
```powershell
cd c:\xampp\htdocs\phidchat\backend
```

### 1.2 Check Dependencies
```powershell
# View installed packages
npm list --depth=0

# If node_modules is empty, install:
npm install
```

### 1.3 Create Environment File
```powershell
# Copy example to actual config
copy .env.example config.env

# Edit config.env with your settings
notepad config.env
```

**Minimum config.env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myplatform
JWT_SECRET=my_super_secret_key_12345
CLIENT_URL=http://localhost:3000
APP_URL=http://localhost:3000
```

### 1.4 Start MongoDB

**Option A: Local MongoDB**
```powershell
# If MongoDB is installed as Windows Service, it runs automatically
# Check if running:
net start | findstr MongoDB

# If not running:
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in config.env:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myplatform
   ```

### 1.5 Start Backend Server
```powershell
# Development mode (auto-restart on changes)
npm run dev

# OR production mode
npm start
```

**✅ Success Output:**
```
Server running on port 5000
MongoDB connected
Socket.io ready for real-time features
```

### 1.6 Test Backend Health
Open browser: http://localhost:5000/api/health

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-24T04:16:00.000Z"
}
```

---

## 🎨 HATUA 2: Setup ya Frontend

### 2.1 Open New Terminal
```powershell
# Keep backend running, open new PowerShell window
cd c:\xampp\htdocs\phidchat\frontend
```

### 2.2 Install Dependencies
```powershell
npm install
```

### 2.3 Create Environment File
```powershell
# Create .env file
notepad .env
```

**Add this content:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 2.4 Start Frontend
```powershell
npm run dev
```

**✅ Success Output:**
```
VITE v5.0.11  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 2.5 Open Browser
Navigate to: http://localhost:3000

---

## 🧪 HATUA 3: Testing Features

### 3.1 Test Authentication

#### A. Register New User
**Using Browser:**
1. Go to http://localhost:3000/register
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Phone: +255712345678
3. Click Register

**Using Postman:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "+255712345678"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65b1234567890abcdef",
    "name": "Test User",
    "email": "test@example.com",
    "isCreator": false
  }
}
```

#### B. Login
**Using Postman:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### C. Get Current User
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 3.2 Test Real-Time Chat

#### A. Connect to Socket.IO

**Frontend Code (React):**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// User comes online
socket.emit('user:online', userId);

// Listen for friend online
socket.on('friend:online', (friendId) => {
  console.log('Friend online:', friendId);
});
```

#### B. Create Conversation
```http
POST http://localhost:5000/api/messages/conversations
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "participantId": "OTHER_USER_ID"
}
```

#### C. Send Message
```http
POST http://localhost:5000/api/messages/conversations/CONVERSATION_ID/messages
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "text": "Hello! This is a test message",
  "type": "text"
}
```

#### D. Test Typing Indicator
```javascript
// Start typing
socket.emit('typing:start', {
  conversationId: 'CONVERSATION_ID'
});

// Stop typing
socket.emit('typing:stop', {
  conversationId: 'CONVERSATION_ID'
});
```

---

### 3.3 Test Social Features

#### A. Create Post
```http
POST http://localhost:5000/api/posts
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "content": "My first post! #testing",
  "visibility": "public"
}
```

#### B. Like Post
```http
POST http://localhost:5000/api/posts/POST_ID/like
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "reactionType": "like"
}
```

#### C. Comment on Post
```http
POST http://localhost:5000/api/comments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "post": "POST_ID",
  "content": "Great post!"
}
```

#### D. Send Friend Request
```http
POST http://localhost:5000/api/friends/request/USER_ID
Authorization: Bearer YOUR_TOKEN
```

#### E. Accept Friend Request
```http
POST http://localhost:5000/api/friends/accept/USER_ID
Authorization: Bearer YOUR_TOKEN
```

---

### 3.4 Test Content Marketplace

#### A. Create Content (as Creator)
```http
POST http://localhost:5000/api/content
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "My First Movie",
  "description": "An amazing Tanzanian film",
  "category": "Movie",
  "price": 5000,
  "videoUrl": "/uploads/movie.mp4",
  "thumbnailUrl": "/uploads/thumbnail.jpg",
  "duration": 7200,
  "tags": ["drama", "swahili", "tanzania"]
}
```

#### B. Browse Content
```http
GET http://localhost:5000/api/content
```

#### C. Get Single Content
```http
GET http://localhost:5000/api/content/CONTENT_ID
```

#### D. Check User Access
```http
GET http://localhost:5000/api/content/CONTENT_ID/access
Authorization: Bearer YOUR_TOKEN
```

---

### 3.5 Test Video Playback (Local)

#### A. Create Test Video Folder
```powershell
# In backend folder
mkdir uploads
mkdir uploads\videos
```

#### B. Add Sample Video
Download a sample MP4 and place in `backend/uploads/videos/sample.mp4`

#### C. Serve Static Files
Add to `backend/server.js`:
```javascript
app.use('/uploads', express.static('uploads'));
```

#### D. Test Video URL
Open browser: http://localhost:5000/uploads/videos/sample.mp4

#### E. Frontend Video Player
```html
<video controls width="600">
  <source src="http://localhost:5000/uploads/videos/sample.mp4" type="video/mp4" />
  Your browser does not support video playback.
</video>
```

---

### 3.6 Test Payment Flow (Test Mode)

#### A. Buy Content
```http
POST http://localhost:5000/api/payments/buy-content
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "contentId": "CONTENT_ID",
  "phoneNumber": "+255712345678",
  "paymentMethod": "MPESA"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "SELCOM_ORDER_ID",
  "paymentUrl": "https://selcom.com/pay/...",
  "amount": 5000
}
```

#### B. Check Wallet Balance
```http
GET http://localhost:5000/api/payments/wallet
Authorization: Bearer YOUR_TOKEN
```

#### C. Get Transaction History
```http
GET http://localhost:5000/api/payments/transactions
Authorization: Bearer YOUR_TOKEN
```

---

## 🔍 HATUA 4: Testing with Multiple Users

### 4.1 Create Multiple Test Users
```powershell
# Use this script to create test users
node backend/seedUsers.js
```

### 4.2 Test Chat Between Users
1. Login as User A in one browser (Chrome)
2. Login as User B in another browser (Firefox/Incognito)
3. Send messages between them
4. Observe real-time delivery

### 4.3 Test Friend System
1. User A sends friend request to User B
2. User B receives notification
3. User B accepts request
4. Both users see each other in friends list

### 4.4 Test Online Status
1. User A logs in → User B sees "User A is online"
2. User A logs out → User B sees "User A went offline"

---

## 🐛 HATUA 5: Debugging Common Issues

### Issue 1: Backend Won't Start
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F

# Restart backend
npm run dev
```

### Issue 2: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```powershell
# Start MongoDB service
net start MongoDB

# Or use MongoDB Atlas connection string
```

### Issue 3: Frontend Can't Connect to Backend
```
Network Error / CORS Error
```

**Solution:**
1. Check backend is running on port 5000
2. Verify `VITE_API_URL` in frontend/.env
3. Check CORS settings in backend/server.js

### Issue 4: Socket.IO Not Working
```
WebSocket connection failed
```

**Solution:**
1. Check Socket.IO client version matches server
2. Verify `VITE_SOCKET_URL` in frontend/.env
3. Check browser console for errors

### Issue 5: JWT Token Expired
```
401 Unauthorized
```

**Solution:**
1. Login again to get new token
2. Update token in Postman/frontend
3. Check JWT_SECRET in config.env

---

## 📊 HATUA 6: Monitor System

### 6.1 Backend Logs
```powershell
# Backend terminal shows:
User connected: socket_id_123
MongoDB connected
POST /api/auth/login 200 45ms
```

### 6.2 Frontend Console
```javascript
// Open browser DevTools (F12)
// Check Console tab for:
console.log('Socket connected');
console.log('Message received:', data);
```

### 6.3 Network Tab
1. Open DevTools → Network tab
2. Filter: XHR/Fetch
3. See all API calls
4. Check request/response

### 6.4 MongoDB Data
```powershell
# Connect to MongoDB shell
mongosh

# Switch to database
use myplatform

# View collections
show collections

# View users
db.users.find().pretty()

# View posts
db.posts.find().pretty()

# Count documents
db.users.countDocuments()
```

---

## ✅ HATUA 7: Verification Checklist

### Backend ✓
- [ ] Server starts on port 5000
- [ ] MongoDB connects successfully
- [ ] Socket.IO initializes
- [ ] Health endpoint responds
- [ ] All routes registered

### Frontend ✓
- [ ] Vite dev server starts on port 3000
- [ ] Page loads without errors
- [ ] API calls work
- [ ] Socket.IO connects
- [ ] UI renders correctly

### Authentication ✓
- [ ] User can register
- [ ] User can login
- [ ] JWT token generated
- [ ] Protected routes work
- [ ] Token validation works

### Real-Time Chat ✓
- [ ] Socket connects
- [ ] Messages send/receive
- [ ] Typing indicators work
- [ ] Online status updates
- [ ] Notifications arrive

### Social Features ✓
- [ ] Posts create/view/delete
- [ ] Comments work
- [ ] Likes work
- [ ] Friend requests work
- [ ] Newsfeed loads

### Content Marketplace ✓
- [ ] Content uploads
- [ ] Content displays
- [ ] Purchase flow works
- [ ] Access control works
- [ ] Wallet updates

### Video System ✓
- [ ] Videos upload
- [ ] Videos play
- [ ] Access control works
- [ ] Ready for Bunny.net

---

## 🎯 HATUA 8: Next Steps (Bunny.net)

### When to Integrate Bunny.net?
**Integrate AFTER these work:**
1. ✅ Login/Register
2. ✅ Chat system
3. ✅ Upload & play local videos
4. ✅ Payment flow (test mode)
5. ✅ Access control

### Bunny.net Setup Steps:
```powershell
# 1. Install Bunny SDK
cd backend
npm install @bunny.net/sdk

# 2. Add to config.env
BUNNY_API_KEY=your_api_key
BUNNY_STORAGE_ZONE=your_zone
BUNNY_VIDEO_LIBRARY_ID=your_library_id

# 3. Create Bunny service
# backend/services/bunny.js

# 4. Update upload routes
# backend/routes/content.js

# 5. Update video player
# frontend/src/components/VideoPlayer.tsx
```

---

## 🔧 Useful Commands

### Backend Commands
```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed test data
node seedUsers.js
node seedDemoData.js

# Check for errors
npm run lint
```

### Frontend Commands
```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

### MongoDB Commands
```powershell
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Connect to shell
mongosh

# Backup database
mongodump --db myplatform --out ./backup

# Restore database
mongorestore --db myplatform ./backup/myplatform
```

### Git Commands (Optional)
```powershell
# Initialize repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/phidchat.git
git push -u origin main
```

---

## 📞 Troubleshooting Help

### Check System Status
```powershell
# Node version
node --version

# NPM version
npm --version

# MongoDB status
net start | findstr MongoDB

# Check running processes
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### Clear Cache & Restart
```powershell
# Backend
cd backend
rm -r node_modules
npm install
npm run dev

# Frontend
cd frontend
rm -r node_modules
npm install
npm run dev
```

### View Logs
```powershell
# Backend logs (in terminal)
# Frontend logs (browser console F12)
# MongoDB logs (check MongoDB log file)
```

---

## 🎉 Success Criteria

Your platform is ready when:

1. ✅ User can register and login
2. ✅ User can send/receive messages in real-time
3. ✅ User can create posts and comment
4. ✅ User can send friend requests
5. ✅ Creator can upload content
6. ✅ User can purchase content
7. ✅ Video plays with access control
8. ✅ Wallet system tracks earnings

**Kisha unaweza kuongeza Bunny.net!** 🚀

---

**Maswali? Check:**
- `README.md` - Project overview
- `ARCHITECTURE.md` - System architecture
- `SOCIAL_FEATURES.md` - Feature documentation

**Kila kitu kiko tayari! Start testing!** 💪
