const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({ email: decoded.email }).select('-password');
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};
  
module.exports = verifyToken;