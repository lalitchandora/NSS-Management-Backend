// models/certificate.model.js
const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issuedAt: {
        type: Date,
        default: Date.now
    }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
