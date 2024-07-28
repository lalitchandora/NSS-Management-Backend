const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const { adminOnly } = require('../middleware/authorization');
const verifyToken = require('../middleware/auth');
// Create a post
router.post('/add', verifyToken, async (req, res) => {
    const { title, content, category, user } = req.body;
    try {
        const post = new Post({ title, content, category, user });
        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Update a post
router.put('/update/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    try {
        const post = await Post.findByIdAndUpdate(id, { title, content, category }, { new: true });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Delete a post
router.delete('/delete/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByIdAndDelete(id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Get all posts
router.get('/all', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name').populate('comments');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

// Add a comment to a post
router.post('/:postId/comment', verifyToken, async (req, res) => {
    const { postId } = req.params;
    const { content, user } = req.body;
    try {
        const comment = new Comment({ content, user, post: postId });
        await comment.save();
        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

module.exports = router;
