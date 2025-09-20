import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // store user token/id
  name: { type: String, required: true },
  upi_Id: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
