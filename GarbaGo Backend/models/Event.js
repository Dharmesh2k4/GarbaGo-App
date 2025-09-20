import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  banner: { type: String },
  createdByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
