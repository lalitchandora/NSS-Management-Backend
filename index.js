const express = require('express');
require('dotenv').config({ path: './config/.env' });
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

const routes = require('./startup/routes');
const connectDB = require('./startup/database');

app.use(express.json());
app.use(cors());
app.use('/api', routes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});