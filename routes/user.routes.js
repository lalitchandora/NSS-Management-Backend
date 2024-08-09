const express = require("express");

const User = require("../models/user.model");
const authorization = require("../middleware/authorization");
const router = express.Router();

router.get("/", [authorization], async (req, res) => {
    try {
        const profile = await User.findOne({ _id: req.user.id }, { name: 1, email: 1, user_type: 1, totalHrs: 1, uid: 1, year: 1, course: 1 });
        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.put("/update", [authorization], async (req, res) => {
    try {
        const { uid, year, course } = req.body;

        const user = await User.findOneAndUpdate({ _id: req.user.id }, { uid, year, course });

        return res.status(200).json({ message: "Profile updated" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;