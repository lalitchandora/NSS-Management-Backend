const express = require("express");

const User = require("../models/user.model");
const authorization = require("../middleware/authorization");
const router = express.Router();

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