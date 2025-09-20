// utils/sendBookingEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "garbago.in@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendBookingEmail = async (toEmail, { name, eventName, date, time, place, amount }) => {
  try {
    const mailOptions = {
      from: "garbago.in@gmail.com",
      to: toEmail,
      subject: `🎊 Booking Confirmed for ${eventName}`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #8B5CF6;">Hello <span style="color:#9333EA;">${name}</span> 🎶</h2>
        <p>Congratulations! Your booking for <strong>${eventName}</strong> is confirmed.</p>

        <h3 style="color:#9333EA;">Booking Details:</h3>
        <ul>
          <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Place:</strong> ${place}</li>
          <li><strong>Amount Paid:</strong> ₹${amount}</li>
        </ul>

        <p>We’re excited to see you at the event! 💃🕺</p>
        <p style="color: red;"><strong>⚠️ Reminder:</strong> Please bring a valid ID and the booking confirmation.</p>

        <br>
        <p>Cheers,<br/>The GarbaGo Team 🎉</p>
      </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to:", toEmail);
  } catch (err) {
    console.error("Error sending booking email:", err);
  }
};
