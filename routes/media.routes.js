const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const authorization = require("../middleware/authorization")

const router = express.Router();

router.post('/file', async (req, res) => {
    const filename = req.body.filePath;
    const fullPath = path.join(__dirname, '..', filename);
    console.log(fullPath, "hii");

    try {
        await fs.access(fullPath, fs.constants.F_OK);
        return res.sendFile(fullPath);
    } catch (error) {
        return res.status(404).json({ error: "File not found" });
    }
})

module.exports = router;