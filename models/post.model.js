const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['suggestion', 'complain', 'idea'], required: true },
    user: { type: String, required: true }, // Changed to String to store email
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);