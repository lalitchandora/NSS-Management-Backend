const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);