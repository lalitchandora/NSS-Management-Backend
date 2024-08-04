const mongoose = require("mongoose");


const eventGallerySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const EventGallery = mongoose.model("EventGallery", eventGallerySchema);

module.exports = EventGallery;