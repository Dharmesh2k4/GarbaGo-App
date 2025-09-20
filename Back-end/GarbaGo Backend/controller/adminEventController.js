import Event from "../models/Event.js";
import { sendEventDetailsEmail } from "../utils/sendEventDetailsEmail.js";
import jwt from 'jsonwebtoken';

// ✅ CREATE EVENT (Admin only)
export const createEvent = async (req, res) => {
  try {
    const { eventName, place, location, date, time, price, seats, description } = req.body;

    console.log("Hre data")
    console.log(req.body);
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "Banner is required!" });
    }

    // Check if event with same name exists
    const existingEvent = await Event.findOne({
      eventName: { $regex: new RegExp(`^${eventName}$`, "i") },
    });
    if (existingEvent) {
      return res.status(400).json({ status: "error", message: "Event with this name already exists!" });
    }

    // Save event in DB
    const event = await Event.create({
      eventName,
      venue: place,                // <-- map place to venue
      location,
      date,
      time,
      price,
      availableSeats: seats,       // <-- map seats to availableSeats
      description,
      banner: req.file.path,
      createdByAdmin: req.admin._id,
    });


    // Send Email (optional)
    await sendEventDetailsEmail(req.admin.email, {
      eventName,
      location: `${place}, ${location}`,
      date,
      time,
      price,
      seats,
      bannerImage: req.file.filename,
    });

    return res.json({
      status: "success",
      message: "Event created successfully!",
      event: { id: event._id, adminId: req.admin._id },
    });
  } catch (err) {
    console.error("❌ Error in createEvent:", err);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

// ✅ GET SINGLE EVENT
export const getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.body; // instead of req.params
    console.log(eventId)
    if (!eventId) return res.status(400).json({ status: "error", message: "EventId required!" });

    const event = await Event.findById(eventId).lean();
    if (!event) return res.status(404).json({ status: "error", message: "Event not found!" });

    if (event.banner) event.banner = `http://localhost:3000/${event.banner.replace(/\\/g, "/")}`;

    return res.json({ status: "success", data: event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};

export const getAllEventsByToken = async (req, res) => {
    try {
        // req.admin is set by verifyAdmin middleware
        const adminId = req.admin._id;

        // Fetch events created by this admin
        const events = await Event.find({ createdByAdmin: adminId }).lean();

        // Fix banner URLs
        const eventsWithFullBanner = events.map(event => {
            if (event.banner) {
                event.banner = `http://localhost:3000/${event.banner.replace(/\\/g, "/")}`;
            }
            return event;
        });

        return res.json({
            status: "success",
            data: eventsWithFullBanner
        });
    } catch (err) {
        console.error("❌ Error fetching events:", err);
        return res.status(500).json({ status: "error", message: "Server Error" });
    }
};

export const getAllEventsPublic = async (req, res) => {
    try {
        const events = await Event.find().lean(); // get all events

        // Fix banner URLs
        const eventsWithFullBanner = events.map(event => {
            if (event.banner) {
                event.banner = `http://localhost:3000/${event.banner.replace(/\\/g, "/")}`;
            }
            return event;
        });

        return res.json({
            status: "success",
            events: eventsWithFullBanner
        });
    } catch (err) {
        console.error("❌ Error fetching events:", err);
        return res.status(500).json({ status: "error", message: "Server Error" });
    }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().lean();
    events.forEach(event => {
      if (event.banner) event.banner = `http://localhost:3000/${event.banner.replace(/\\/g, "/")}`;
    });
    res.json({ status: "success", data: events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};


// ✅ UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const { eventId, eventName, place, location, date, time, price, seats, description } = req.body;

    if (!eventId) return res.status(400).json({ status: "error", message: "EventId required!" });

    const updatedData = { eventName, place, location, date, time, price, seats, description };
    if (req.file) updatedData.banner = req.file.path;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });
    if (!updatedEvent) return res.status(404).json({ status: "error", message: "Event not found!" });

    return res.json({ status: "success", message: "Event updated successfully!", data: updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};

// ✅ DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) return res.status(400).json({ status: "error", message: "EventId required!" });

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) return res.status(404).json({ status: "error", message: "Event not found!" });

    return res.json({ status: "success", message: "Event deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};
