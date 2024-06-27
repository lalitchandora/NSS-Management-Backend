const mongoose = require("mongoose");

module.exports = function () {
    const connectionStr = "******";

    // mongoose.set("strictQuery", true);

    mongoose.connect(connectionStr);
}