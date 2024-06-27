const express = require('express');
const router = express.Router();

const User = require("../models/user.model");

router.get('/login', (req, res) => {
    res.status(200).json({ hello: 'login' });
})

router.get('/signup', async (req, res) => {
    const user = new User({
        name: "lala",
        user_type: "admin"
    })
    await user.save();
    res.status(200).json({ hello: 'signup' });
})

module.exports = router;