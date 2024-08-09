const express = require("express");
const User = require("../models/user.model");
const { adminOnly } = require("../middleware/authorization");
const generateXLS = require("../services/excel");

const router = express.Router();

router.get("/yearList", [adminOnly], async (req, res) => {
    try {
        const yearArr = await User.distinct('year');

        return res.status(200).json({ yearArr });
    } catch (error) {
        return res.status(500).json({ error });
    }
})

router.get("/:year", [adminOnly], async (req, res) => {
    try {
        const userData = await User.find({ year: req.params.year }, { name: 1, totalHrs: 1, uid: 1, course: 1 });
        if (userData.length > 0) {
            const xlsx = await generateXLS(userData, year);
            console.log(xlsx);

            res.set("Content-Disposition", "attachment; filename=data.xls");
            res.type("application/vns.ms-excel");
            res.send(xlsx);
        }
    } catch (error) {
        return res.status(500).json({ error, msg: "ji" });
    }
})

module.exports = router;