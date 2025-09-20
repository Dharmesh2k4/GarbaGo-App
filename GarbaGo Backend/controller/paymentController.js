import Payment from "../models/Payment.js";
import jwt from 'jsonwebtoken'
import Event from '../models/Event.js'

export const savePaymentDetails = async (req, res) => {
  try {
    const { name, upi_Id, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: "error", message: "User ID required" });
    }

    // Check if payment exists for user
    let payment = await Payment.findOne({ userId });
    if (payment) {
      // Update existing
      payment.name = name;
      payment.upi_Id = upi_Id;
      await payment.save();
    } else {
      // Create new
      payment = await Payment.create({ userId, name, upi_Id });
    }

    return res.json({ status: "success", message: "Payment saved successfully!", payment });
  } catch (err) {
    console.error("Error saving payment:", err);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};


export const getPaymentDetails = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("🔹 Received token:", token);
    console.log("🔹 SECRET_KEY:", process.env.SECRET_KEY);

    if (!token) {
      return res.status(400).json({ status: "error", message: "Token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("✅ Decoded token:", decoded);
    } catch (err) {
      console.error("❌ JWT Verify error:", err.message);
      return res.status(401).json({ status: "error", message: "Invalid or expired token" });
    }

    const userId = decoded.id;
    const payment = await Payment.findOne({ userId }).lean();

    return res.json({ status: "success", data: payment || null });
  } catch (err) {
    console.error("Error fetching payment:", err);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};


export const getPaymentByEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId)
      return res.status(400).json({ status: "error", message: "EventId required" });

    // Fetch event
    const event = await Event.findById(eventId).lean();
    if (!event)
      return res.status(404).json({ status: "error", message: "Event not found" });

    // Fetch admin payment (hardcoded admin ID)
    const adminId = "68cd5a0297b0ad370cd9b5b5";
    const payment = await Payment.findOne({ userId: adminId }).lean();
    if (!payment)
      return res.status(404).json({ status: "error", message: "Payment info not found" });

    return res.json({
      status: "success",
      data: {
        amount: event.price,
        renterName: payment.name,
        upiId: payment.upi_Id,
        platformName: "garbago", // can hardcode or fetch from event if needed
        email: "admin@garbago.com" // dummy email for frontend
      }
    });
  } catch (err) {
    console.error("Error in getPaymentByEvent:", err);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};