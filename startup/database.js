const mongoose = require("mongoose");

module.exports = function () {
    const connectionStr = process.env.MONGO_DB;
    mongoose.connect(connectionStr);
    console.log("Database connected!");
}