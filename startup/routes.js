const express = require('express');
const router = express.Router();
const app = express();

const authRoutes = require("../routes/auth.routes");

router.use('/auth', authRoutes);

module.exports = router;