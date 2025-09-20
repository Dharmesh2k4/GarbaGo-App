import express from "express";
import { createEvent, updateEvent, getAllEvents, getEventDetails,deleteEvent, getAllEventsByToken, getAllEventsPublic} from "../controller/adminEventController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";
import { uploadEventBanner } from "../middleware/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only routes
router.post("/create", verifyAdmin, uploadEventBanner.single("banner"), createEvent);
router.put("/update/:id", verifyAdmin, uploadEventBanner.single("banner"), updateEvent);
router.post("/getEventDetails", getEventDetails);
router.get("/getAllEvents", verifyAdmin, getAllEvents);
router.delete('/deleteEvent/:eventId', verifyAdmin, deleteEvent);
router.get("/all", verifyAdmin, getAllEventsByToken);
router.get("/", getAllEventsPublic);

export default router;
