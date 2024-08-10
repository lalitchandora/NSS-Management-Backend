
const express = require("express");
const User = require("../models/user.model");
const authorization = require("../middleware/authorization");
const router = express.Router();

// Get user profile
router.get("/profile", [authorization], async (req, res) => {
    try {
        const profile = await User.findById(req.user.id).select('name email user_type totalHrs uid year course');
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update user profile
router.put("/update", [authorization], async (req, res) => {
    try {
        const { uid, year, course } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { uid, year, course }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get eligible users for certificate
router.get('/eligible-for-certificate', [authorization], async (req, res) => {
    try {
        const eligibleUsers = await User.find({ totalHrs: { $gte: 240 }, user_type: 'volunteer' }).select('name email totalHrs');
        res.json(eligibleUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching eligible users', error: error.message });
    }
});

// Get all users (admin only)
router.get('/all', [authorization], async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.user_type !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        const users = await User.find({ user_type: 'volunteer' }).select('name email user_type totalHrs uid year course');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

module.exports = router;
