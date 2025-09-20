import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:String,
    otp:Number
})

export const OTP = mongoose.model("OTP",otpSchema);