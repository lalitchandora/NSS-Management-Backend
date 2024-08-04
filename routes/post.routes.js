const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const verifyToken = require('../middleware/auth');

// Create a post
router.post('/add', verifyToken, async (req, res) => {
    const { title, content, category } = req.body;
    try {
        const post = new Post({ title, content, category, user: req.user.email });
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
        // Delete associated comments
        await Comment.deleteMany({ post: id });
        res.status(200).json({ message: 'Post and associated comments deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Get all posts with comments
router.get('/all', async (req, res) => {
    try {
        const posts = await Post.find().populate({
            path: 'comments',
            options: { sort: { 'date': -1 } }
        }).sort({ date: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

// Add a comment to a post
router.post('/:postId/comment', verifyToken, async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const comment = new Comment({ content, user: req.user.email, post: postId });
        await comment.save();

        post.comments.push(comment._id);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Get all comments for a post
router.get('/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.find({ post: postId }).sort({ date: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get comments' });
    }
});

// Delete a comment
router.delete('/:postId/comment/:commentId', verifyToken, async (req, res) => {
    const { postId, commentId } = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        if (comment.user !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(commentId);
        await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

module.exports = router;