const express = require('express');
const router = express.Router();

const authRoutes = require('../routes/auth.routes');
const eventRoutes = require('../routes/event.routes');
const eventAttendanceRoutes = require('../routes/eventAttendance.routes');

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/attendance', eventAttendanceRoutes);

module.exports = router;
