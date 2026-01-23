require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const friendRoutes = require('./routes/friends');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myplatform')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io for real-time features
const User = require('./models/User');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins their room
  socket.on('user:online', async (userId) => {
    socket.userId = userId;
    socket.join(`user:${userId}`);
    
    // Update user online status
    await User.findByIdAndUpdate(userId, { 
      isOnline: true, 
      lastActive: new Date() 
    });
    
    // Notify friends
    const user = await User.findById(userId).populate('friends.user');
    user.friends.forEach(friend => {
      io.to(`user:${friend.user._id}`).emit('friend:online', userId);
    });
  });

  // User goes offline
  socket.on('disconnect', async () => {
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, { 
        isOnline: false, 
        lastActive: new Date() 
      });
      
      // Notify friends
      const user = await User.findById(socket.userId).populate('friends.user');
      if (user) {
        user.friends.forEach(friend => {
          io.to(`user:${friend.user._id}`).emit('friend:offline', socket.userId);
        });
      }
    }
    console.log('User disconnected:', socket.id);
  });

  // Join conversation room
  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  // Leave conversation room
  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Typing indicator
  socket.on('typing:start', (data) => {
    socket.to(`conversation:${data.conversationId}`).emit('typing:start', {
      userId: socket.userId,
      conversationId: data.conversationId
    });
  });

  socket.on('typing:stop', (data) => {
    socket.to(`conversation:${data.conversationId}`).emit('typing:stop', {
      userId: socket.userId,
      conversationId: data.conversationId
    });
  });

  // New message
  socket.on('message:send', (data) => {
    io.to(`conversation:${data.conversationId}`).emit('message:new', data.message);
  });

  // Message read
  socket.on('message:read', (data) => {
    io.to(`conversation:${data.conversationId}`).emit('message:read', data);
  });

  // New notification
  socket.on('notification:send', (data) => {
    io.to(`user:${data.recipientId}`).emit('notification:new', data.notification);
  });
});

// Make io accessible in routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io ready for real-time features`);
});

module.exports = { app, io };
