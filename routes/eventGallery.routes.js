const express = require('express');
const EventGallery = require("../models/eventGallery.model");
const authorization = require("../middleware/authorization");
const upload = require('../startup/storage');

const router = express.Router();

router.post("/create", [authorization, upload.single("file")], async (req, res) => {
    try {
        const { eventId } = req.body;
        const eventGallery = new EventGallery({ eventId, userId: req.user.id, image: req.file.filename });
        await eventGallery.save();
        return res.status(200).json({ message: "Image uploaded successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error" + error });
    }
});

module.exports = router;