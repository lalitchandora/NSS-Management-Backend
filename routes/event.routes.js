const express = require('express');
const Event = require('../models/event.model');
const { adminOnly } = require('../middleware/authorization');

const router = express.Router();

const getEventStatus = (dateTime) => {
    const now = new Date();
    const eventDate = new Date(dateTime);
    if (eventDate > now) return 'upcoming';
    if (eventDate < now) return 'past';
    return 'ongoing';
};

// Add an event (Admin only)
router.post('/add', adminOnly, async (req, res) => {
    const { name, title, hrs, type, photo, description, volunteersRequired, dateTime, location } = req.body;
    try {
        const event = new Event({ name, title, hrs, type, photo, description, volunteersRequired, dateTime, location });
        await event.save();
        res.status(201).json({ message: 'Event added successfully', event });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// Delete an event (Admin only)
router.delete('/delete/:id', adminOnly, async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByIdAndDelete(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Update an event (Admin only)
router.put('/update/:id', adminOnly, async (req, res) => {
    const { id } = req.params;
    const { name, title, hrs, type, photo, description, volunteersRequired, dateTime, location } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(id, { name, title, hrs, type, photo, description, volunteersRequired, dateTime, location }, { new: true });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Get all events
router.get('/all', async (req, res) => {
    try {
        const events = await Event.find();
        const eventsWithStatus = events.map(event => ({
            ...event._doc,
            status: getEventStatus(event.dateTime)
        }));
        res.status(200).json(eventsWithStatus);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get events' });
    }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ ...event._doc, status: getEventStatus(event.dateTime) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get event' });
    }
});

module.exports = router;
