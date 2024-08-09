const mongoose = require("mongoose");
const User = require("./user.model");
const Event = require("./event.model");

const eventAttendanceSchema = new mongoose.Schema({
    eventId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
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
        required: true
    }
});

eventAttendanceSchema.post('save', async (doc, next) => {
    if (doc.actualAttendance) {
        try {
            const event = await Event.findOne({ _id: doc.eventId });
            await User.findOneAndUpdate({ _id: doc.userId }, { $inc: { totalHrs: event.hrs } });
        } catch (error) {
            console.log(error);
        }
    }
    next();
})

const EventAttendance = mongoose.model("EventAttendance", eventAttendanceSchema);

module.exports = EventAttendance;