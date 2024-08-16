const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("../services/jwt");
const User = require("../models/user.model");
const { adminOnly } = require("../middleware/authorization");

router.post("/signup", async (req, res) => {
  const { name, email, password, user_type } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = new User({ name, email, password, user_type, adminApproved: true });
    await user.save();
    const token = jwt.generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" + error });
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
      console.log('password wrong')
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.generateToken(user);
    res.status(200).json({
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put("/request/accept/:id", [adminOnly], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, {
      adminApproved: true
    },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ message: "User approved", user });
  } catch (error) {
    return res.status(500).json({ error: "Request error" })
  }
});

router.put("/request/reject/:id", [adminOnly], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, {
      adminApproved: false
    },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ message: "User Rejected", user });
  } catch (error) {
    return res.status(500).json({ error: "Request error" })
  }
});

module.exports = router;
