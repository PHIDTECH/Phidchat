require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const users = [];
const content = [];
const transactions = [];

// Helper to generate token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Tafadhali ingia kwanza' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u._id === decoded.userId);
    
    if (!user) return res.status(401).json({ success: false, message: 'Mtumiaji hapatikani' });
    
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token si sahihi' });
  }
};

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'Email hii imeshatumika' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      phone,
      password: hashedPassword,
      profilePicture: '',
      verified: false,
      wallet: { balance: 0, currency: 'TZS' },
      isCreator: false,
      role: 'user',
      followers: [],
      following: [],
      purchasedContent: [],
      createdAt: new Date()
    };

    users.push(user);
    const token = generateToken(user._id);
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ success: true, token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email au password si sahihi' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email au password si sahihi' });
    }

    const token = generateToken(user._id);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ success: true, token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Get current user
app.get('/api/auth/me', auth, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ success: true, user: userWithoutPassword });
});

// Get all content
app.get('/api/content', (req, res) => {
  const { category } = req.query;
  let filtered = content.filter(c => c.status === 'PUBLISHED');
  
  if (category) {
    filtered = filtered.filter(c => c.category === category);
  }

  const contentsWithCreator = filtered.map(c => {
    const creator = users.find(u => u._id === c.creatorId);
    return { ...c, creator: creator ? { _id: creator._id, name: creator.name, profilePicture: creator.profilePicture, verified: creator.verified } : null };
  });

  res.json({ contents: contentsWithCreator, total: contentsWithCreator.length, pages: 1, currentPage: 1 });
});

// Get single content
app.get('/api/content/:id', (req, res) => {
  const item = content.find(c => c._id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Content haipatikani' });
  }

  const creator = users.find(u => u._id === item.creatorId);
  res.json({ ...item, creator });
});

// Get transactions
app.get('/api/payments/transactions', auth, (req, res) => {
  const userTransactions = transactions.filter(t => t.userId === req.userId);
  res.json(userTransactions);
});

// Get wallet
app.get('/api/payments/wallet', auth, (req, res) => {
  res.json({
    balance: req.user.wallet.balance,
    currency: req.user.wallet.currency,
    pendingWithdrawals: 0
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), users: users.length, content: content.length });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📊 In-memory database ready`);
  console.log(`👥 Users: ${users.length}`);
  console.log(`🎬 Content: ${content.length}\n`);
});
