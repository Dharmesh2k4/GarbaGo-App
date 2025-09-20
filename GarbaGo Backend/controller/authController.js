import { Users } from "../models/Users.js";
import { OTP } from "../models/OTP.js";
import { Admin } from "../models/Admin.js"; // make sure you have this model
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// 🔹 Generate 6-digit OTP
function generateOTP() {
    return (Math.floor(100000 + Math.random() * 900000)).toString();
}

// 🔹 Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "garbago.in@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});


export const sendLoginOTP = async (req, res) => {
    try {
        const { email } = req.body;
        let name = "";
        let role = "";

        // 1️⃣ Check if email belongs to an admin
        const admin = await Admin.findOne({ email });
        if (admin) {
            name = admin.name || "Admin";
            role = "admin";
        } else {
            // 2️⃣ Check if email belongs to a user
            const user = await Users.findOne({ email });
            if (!user) {
                // User not found → STOP here, no OTP
                return res.status(404).json({ message: "Account Not Found!" });
            }
            name = user.name;
            role = "user";
        }

        // ✅ Only generate OTP if account exists
        const otpcode = generateOTP();

        // Remove any previous OTPs for this email
        await OTP.deleteMany({ email });

        // Save new OTP
        const newOTP = new OTP({ email, otp: otpcode });
        await newOTP.save();

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject:
                role === "admin"
                    ? "🔐 GarbaGo Admin Login OTP"
                    : "🔐 GarbaGo User Login OTP",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #8B5CF6;">Welcome Back to <span style="color:#9333EA;">GarbaGo</span> 🎉</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>To securely log in to your ${role} account, please use the following One-Time Password (OTP):</p>
          <h1 style="color: #9333EA; text-align: center;">${otpcode}</h1>
          <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
          <p style="color: red;"><strong>⚠️ Security Tip:</strong> GarbaGo will never ask for your OTP via call or SMS.</p>
          <br>
          <p>Thank you for choosing <strong>GarbaGo</strong> 🙏</p>
          <p>Keep Dancing,<br/>The GarbaGo Team 💃🕺</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        // Return success and role
        res.json({ message: "success", role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error sending email" });
    }
};



// ------------------- REGISTER OTP -------------------
export const sendRegisterOTP = async (req, res) => {
    try {
        const { name, email } = req.body;
        let existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.json({ message: "Already Exists" });
        }

        const otpcode = generateOTP();

        await OTP.deleteMany({ email });
        const newOTP = new OTP({ email, otp: otpcode });
        await newOTP.save();

        const mailOptions = {
            from: 'garbago.in@gmail.com',
            to: email,
            subject: '🎊 Welcome to GarbaGo - Verify Your Email',
            html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #8B5CF6;">Welcome to <span style="color:#9333EA;">GarbaGo</span> 🎶</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>We’re thrilled to have you join the <strong>GarbaGo Community</strong>! Before we get started, please verify your email address using the One-Time Password (OTP) below:</p>
      
      <h1 style="color: #9333EA; text-align: center;">${otpcode}</h1>
      
      <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
      <p style="color: red;"><strong>⚠️ Security Tip:</strong> Never share your OTP with others for your safety.</p>
      
      <br>
      <p>Get ready to book, dance, and enjoy the best Garba nights with us! 💃🕺</p>
      <p>Cheers,<br/>The GarbaGo Team 🎉</p>
    </div>
  `
        };


        await transporter.sendMail(mailOptions);
        res.json({ message: "success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error sending email" });
    }
};


export const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp, name } = req.body; // name required for registration

    console.log(`email: ${email} name : ${name} , otp : ${otp}`);
    // 1️⃣ Check OTP
    const existingOTP = await OTP.findOne({ email });
    if (!existingOTP) return res.status(404).json({ message: "NO OTP FOUND!" });
    if (existingOTP.otp.toString() !== otp.toString())
      return res.status(400).json({ message: "Invalid OTP" });

    // 2️⃣ Delete OTP after verification
    await OTP.deleteMany({ email });

    // 3️⃣ Ensure user does not already exist
    let user = await Users.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 4️⃣ Create new user
    user = await Users.create({ name, email });

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email,
        role: "user",
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // ✅ Send back user details too
    return res.json({
      message: "success",
      token,
      role: "user",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};


export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Check OTP
    const existingOTP = await OTP.findOne({ email });
    if (!existingOTP) return res.status(404).json({ message: "NO OTP FOUND!" });
    if (existingOTP.otp.toString() !== otp.toString())
      return res.status(400).json({ message: "Invalid OTP" });

    // 2️⃣ Delete OTP after verification
    await OTP.deleteMany({ email });

    // 3️⃣ Determine account type
    let role = "";
    let account = await Admin.findOne({ email });
    if (account) role = "admin";
    else {
      account = await Users.findOne({ email });
      if (account) role = "user";
    }

    // 4️⃣ Account must exist
    if (!account) return res.status(404).json({ message: "Account Not Found!" });

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      {
        id: account._id,
        name: account.name,
        email,
        role,
      },
      SECRET_KEY,
    );

    // ✅ Send back user details too
    return res.json({
      message: "success",
      token,
      role,
      user: { name: account.name, email: account.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
