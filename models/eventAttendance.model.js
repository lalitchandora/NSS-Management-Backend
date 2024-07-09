const mongoose = require("mongoose");

const eventAttendanceSchema = new mongoose.Schema({
    eventId: 
    {   type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    },
    userId: 
    {   type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    status: { 
        type: String, 
        enum: ['accepted', 'rejected'], 
        required: true 
    },
    actualAttendance: { 
        type: Boolean, 
        default: false 
    }
});

const EventAttendance = mongoose.model("EventAttendance", eventAttendanceSchema);

module.exports = EventAttendance;
