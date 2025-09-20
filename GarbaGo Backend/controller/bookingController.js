import jwt from "jsonwebtoken";
import Event from "../models/Event.js";
import BookedEvent from "../models/BookedEvent.js";
import { sendBookingEmail } from "../utils/sendBookingEmail.js";
import { Users } from "../models/Users.js";

const ADMIN_ID = "68cd5a0297b0ad370cd9b5b5"; // Admin ID fixed

export const bookEvent = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ status: "error", message: "Token missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;

    const { eventId, paymentId } = req.body;
    const event = await Event.findById(eventId).lean();
    if (!event)
      return res.status(404).json({ status: "error", message: "Event not found" });

    // ✅ Check seat availability
    if (event.seats <= 0)
      return res.status(400).json({ status: "error", message: "No seats available" });

    // ✅ Prevent organizer (admin) from booking own event (optional, unlikely)
    if (userId === ADMIN_ID)
      return res.status(403).json({ status: "error", message: "Admin cannot book own event" });

    // ✅ Prevent duplicate booking
    const alreadyBooked = await BookedEvent.findOne({ eventId, userId });
    if (alreadyBooked)
      return res.status(400).json({ status: "error", message: "You have already booked this event" });

    // ✅ Decrease seats
    await Event.findByIdAndUpdate(eventId, { $inc: { seats: -1 } });

    // ✅ Save booking with admin as organizer
    const booked = await BookedEvent.create({
      eventId,
      userId,
      organizerId: ADMIN_ID,
      paymentId,
      amountPaid: event.price,
    });

    // ✅ Send confirmation email
    const user = await Users.findById(userId).lean();
    await sendBookingEmail(user.email, {
      name: user.name,
      eventName: event.eventName,
      date: event.date,
      time: event.time,
      place: event.place,
      amount: event.price,
    });

    res.json({ status: "success", message: "Event booked successfully", booked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ status: "error", message: "Token missing" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;

    const bookedEvents = await BookedEvent.find({ userId })
      .populate("eventId")
      .lean();

    const formatted = bookedEvents.map((b) => {
      const event = b.eventId || {};
      return {
        ...b,
        event: {
          _id: event._id,
          eventName: event.eventName,
          organizer: "Admin", // always show admin
          place: event.place,
          location: event.location,
          date: event.date,
          time: event.time,
          price: event.price,
          banner: event.banner
            ? `http://localhost:3000/${event.banner.replace(/\\/g, "/")}`
            : null,
        },
      };
    });

    res.json({ status: "success", bookedEvents: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};


export const getAllEventsWithBooking = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ status: "error", message: "Token missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({ status: "error", message: "Access denied" });
    }

    const events = await Event.find().lean();

    const eventsWithBooking = await Promise.all(
      events.map(async (event) => {
        // Count how many times this event has been booked
        const totalBooked = await BookedEvent.countDocuments({ eventId: event._id });

        // Calculate seats remaining
        const seatsRemaining = event.availableSeats - totalBooked;

        console.log(seatsRemaining)
        return {
          _id: event._id,
          eventName: event.eventName,
          banner: event.banner,
          totalBooked,
          seatsRemaining: seatsRemaining >= 0 ? seatsRemaining : 0, // safety check
        };
      })
    );

    return res.json({ status: "success", events: eventsWithBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};