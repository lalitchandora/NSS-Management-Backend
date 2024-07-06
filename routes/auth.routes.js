const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt');
const User = require("../models/user.model");

router.post('/signup', async (req, res) => {
    const { name, email, password, user_type } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = new User({ name, email, password, user_type });
        await user.save();
        const token = jwt.generateToken(user);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
	console.log(email, password);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;