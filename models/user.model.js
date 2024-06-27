const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true
    }
})

const User = new mongoose.model("User", userSchema);

module.exports = User;