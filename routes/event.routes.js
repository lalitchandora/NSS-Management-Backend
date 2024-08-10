const express = require("express");
const Event = require("../models/event.model");
const { adminOnly } = require("../middleware/authorization");
const { getEventStatus } = require("../utility");
const upload = require("../startup/storage");
const EventGallery = require("../models/eventGallery.model");

const router = express.Router();

// Add an event (Admin only)
router.post("/add", [adminOnly, upload.single('photo')], async (req, res) => {

  const {
    name,
    title,
    hrs,
    type,
    description,
    volunteersRequired,
    dateTime,
    location,
  } = req.body;
  try {
    const event = new Event({
      name,
      title,
      hrs,
      type,
      photo: req.file ? req.file.filename : undefined,
      description,
      volunteersRequired,
      dateTime,
      location,
    });
    await event.save();
    res.status(201).json({ message: "Event added successfully", event });
  } catch (error) {
    res.status(500).json({ error: "Failed to add event", msg: error });
  }
});

// Delete an event (Admin only)
router.delete("/delete/:id", adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Update an event (Admin only)
router.put("/update/:id", [adminOnly, upload.single('photo')], async (req, res) => {
  const { id } = req.params;
  const {
    name,
    title,
    hrs,
    type,
    description,
    volunteersRequired,
    dateTime,
    location,
  } = req.body;
  try {
    const event = await Event.findByIdAndUpdate(
      id,
      {
        name,
        title,
        hrs,
        type,
        photo: req.photo ? req.photo.path : undefined,
        description,
        volunteersRequired,
        dateTime,
        location,
      },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Get all events
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find();
    // let ongoing = [];
    // let past = [];
    // let future = [];
    // events.forEach(event => {
    //   switch (getEventStatus(event.dateTime)) {
    //     case "upcoming":
    //       future.push(event._doc);
    //       break;
    //     case "ongoing":
    //       ongoing.push(event._doc);
    //       break;
    //     case "past":
    //       past.push(event._doc);
    //       break;
    //     default:
    //       break;
    //   }
    // })

    // const eventsObj = {
    //   upcoming: future,
    //   ongoing: ongoing,
    //   past: past
    // }

    res.status(200).json({ eventsArr: events });
  } catch (error) {
    res.status(500).json({ error: "Failed to get events" });
  }
});

// Get a single event by ID
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const event = await Event.findById(id);
//     if (!event) return res.status(404).json({ error: "Event not found" });

//     const eventGallery = await EventGallery.find({ eventId: id }, { image: 1 });

//     if (eventGallery.length > 0) {
//       event._doc.images = eventGallery;
//     }
//     res
//       .status(200)
//       .json({ ...event._doc, status: getEventStatus(event.dateTime) });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to get event" + error });
//   }
// });
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const eventGallery = await EventGallery.find({ eventId: id }, { image: 1 });

    event._doc.images = eventGallery.length > 0 ? eventGallery : [];

    res
      .status(200)
      .json({ ...event._doc, status: getEventStatus(event.dateTime) });
  } catch (error) {
    res.status(500).json({ error: "Failed to get event" + error });
  }
});
module.exports = router;
