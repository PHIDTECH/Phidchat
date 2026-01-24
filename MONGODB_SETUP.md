# 🗄️ MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Recommended for Development)

### Download & Install
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Choose Windows version
3. Run installer (use default settings)
4. MongoDB will install as a Windows Service and start automatically

### Verify Installation
```powershell
mongod --version
```

### Start MongoDB Service
```powershell
net start MongoDB
```

---

## Option 2: Use MongoDB Atlas (Cloud - Already Configured)

Your project already has Atlas configured, but there was a DNS issue. To fix:

1. Go to https://cloud.mongodb.com
2. Login to your account
3. Check if cluster is running
4. Get new connection string
5. Update `backend/config.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myplatform
```

---

## Option 3: Quick Test with MongoDB Memory Server

For quick testing without installation:

```powershell
cd backend
npm install mongodb-memory-server --save-dev
```

Then update `backend/server.js` to use memory server for development.

---

## Current Status

Your `config.env` is now set to:
```env
MONGODB_URI=mongodb://localhost:27017/myplatform
```

This will work once MongoDB is installed locally.

---

## Quick Fix: Revert to Atlas

If you want to use Atlas again, edit `backend/config.env`:
```env
MONGODB_URI=mongodb+srv://Phidchat_db:M9RjNWQ3xIqQRvNP@phidchat.g6vc44.mongodb.net/myplatform?retryWrites=true&w=majority
```

Then check your internet connection and Atlas cluster status.
