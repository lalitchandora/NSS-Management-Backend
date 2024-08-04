const express = require('express');
const EventAttendance = require('../models/eventAttendance.model');
const authorization = require('../middleware/authorization');

const router = express.Router();

// Create attendance entry
router.post('/create', authorization, async (req, res) => {
    const { eventId, status } = req.body;
    const userId = req.user.id;
    try {
        const existingAttendance = await EventAttendance.findOne({ eventId, userId });
        if (existingAttendance) {
            return res.status(400).json({ error: 'Attendance already recorded for this user and event' });
        }
        const attendance = new EventAttendance({ eventId, userId, status });
        await attendance.save();
        res.status(201).json({ message: 'Attendance recorded successfully', attendance });
    } catch (error) {
        res.status(500).json({ error: 'Failed to record attendance' });
    }
});

// Update actual attendance
router.put('/actual/:id', authorization, async (req, res) => {
    const { id } = req.params;
    const { actualAttendance } = req.body;
    try {
        const attendance = await EventAttendance.findById(id);
        if (!attendance) return res.status(404).json({ error: 'Attendance record not found' });
        attendance.actualAttendance = actualAttendance;
        await attendance.save();
        res.status(200).json({ message: 'Actual attendance updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update actual attendance' });
    }
});

// Get attendance by event ID
router.get('/event/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const attendance = await EventAttendance.find({ eventId }).populate('userId', 'name email');
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get attendance' });
    }
});

module.exports = router;
