const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    hrs: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    volunteersRequired: {
        type: Number,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
