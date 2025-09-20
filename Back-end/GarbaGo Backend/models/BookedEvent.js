// models/BookedEvent.js
import mongoose from "mongoose";

const BookedEventSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // organizer of the event
  amountPaid: { type: Number, required: true },
  paymentId: { type: String },
  bookedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("BookedEvent", BookedEventSchema);
