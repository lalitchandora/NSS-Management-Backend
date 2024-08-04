const jwt = require('jsonwebtoken');

const generateToken = (user) => {
   // return jwt.sign({ id: user._id, user_type: user.user_type }, process.env.JWT_SECRET, {
    return jwt.sign({ email: user.email, user_type: user.user_type }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
};
