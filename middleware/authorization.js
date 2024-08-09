const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

// module.exports.adminOnly = function (req, res, next) {
//     const token = req.header('x-auth-token');
//     if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         if (req.user.user_type !== 'admin') {
//             return res.status(403).json({ error: 'Access denied. Admins only.' });
//         }
//         next();
//     } catch (error) {
//         res.status(400).json({ error: 'Invalid token.' });
//     }
// };

module.exports.adminOnly = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (decoded.user_type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
