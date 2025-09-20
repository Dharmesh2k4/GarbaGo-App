// routes/booking.js
import express from "express";
import { bookEvent,getMyBookings, getAllEventsWithBooking } from "../controller/bookingController.js"
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminAuth.js";
const router = express.Router();

router.post("/book", verifyToken, bookEvent);
router.get("/myBookings", verifyToken, getMyBookings);
router.get("/bookedEvents", verifyAdmin, getAllEventsWithBooking);

export default router;
