const express = require('express');
require("dotenv").config({ path: "./config/.env" });
const app = express();
const PORT = 3000
const cors = require("cors")
const routes = require("./startup/routes");

app.use(express.json());
app.use(cors());
app.use("/api", routes);
require("./startup/database")()

app.listen(PORT, (req, res) => {
    console.log('Server started on port', PORT);
})