const express = require('express');
const router = express.Router();

const authRoutes = require('../routes/auth.routes');
const eventRoutes = require('../routes/event.routes');
const eventAttendanceRoutes = require('../routes/eventAttendance.routes');
const mediaRoutes = require('../routes/media.routes');
const userRoutes = require('../routes/user.routes');
const galleryRoutes = require('../routes/eventGallery.routes');
const reportRoutes = require('../routes/reports.routes');

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/attendance', eventAttendanceRoutes);
router.use('/media', mediaRoutes);
router.use('/profile', userRoutes);
router.use('/gallery', galleryRoutes);
router.use('/reports', reportRoutes);
module.exports = router;
