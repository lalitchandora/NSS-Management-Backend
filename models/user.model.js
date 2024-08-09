const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true
    },
    adminApproved: {
        type: Boolean,
        default: true,
        required: true
    },
    totalHrs: {
        type: Number,
        default: 0,
        required: true
    },
    uid: {
        type: String,
    },
    year: {
        type: String
    },
    course: {
        type: String
    },

})
// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare given password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", userSchema);

module.exports = User;