const express = require('express');
const app = express();
const PORT = 3000

const routes = require("./startup/routes");

app.use("/api", routes);
require("./startup/database")()

app.listen(PORT, (req, res) => {
    console.log('Server started on port', PORT);
})