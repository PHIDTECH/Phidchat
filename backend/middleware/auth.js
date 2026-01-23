const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Tafadhali ingia kwanza' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Mtumiaji hapatikani' 
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token si sahihi' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token imeisha muda' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Hitilafu ya server' 
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Huna ruhusa ya kufanya hivi' 
        });
      }
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Hitilafu ya server' 
    });
  }
};

const creatorAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.isCreator && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Lazima uwe creator kufanya hivi' 
        });
      }
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Hitilafu ya server' 
    });
  }
};

module.exports = { auth, optionalAuth, adminAuth, creatorAuth };
