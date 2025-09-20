import nodemailer from "nodemailer";


export const sendEventDetailsEmail = async (organizerEmail, event) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "garbago.in@gmail.com",
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
  try {
    const mailOptions = {
      from: "garbago.in@gmail.com",
      to: organizerEmail,
      subject: `📅 Event Created: ${event.eventName}`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color:#8B5CF6;">🎉 Your Event Has Been Created Successfully!</h2>
        <p>Dear <strong>${event.organizerName}</strong>,</p>

        <p>Thank you for organizing with <strong>GarbaGo</strong>! Here are your event details:</p>

        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Event Name</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.eventName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Date</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.date}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Time</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.time}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Location</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.location}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Price</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">₹${event.price}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Total Seats</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${event.seats}</td>
          </tr>
        </table>

        ${event.bannerImage
          ? `<p style="margin-top:15px;">Here’s your event banner:</p>
               <img src="${process.env.BASE_URL}/uploads/events/${event.bannerImage}" 
               alt="Event Banner" style="max-width:100%; border-radius:8px;"/>`
          : ""
        }

        <br>
        <p style="margin-top: 20px;">We wish you all the best for your event.  
        Manage your bookings anytime in your <strong>GarbaGo Dashboard</strong>.</p>

        <p>Cheers,<br/>The GarbaGo Team 🎊</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Event details email sent to organizer");
  } catch (err) {
    console.error("❌ Error sending event details email:", err);
  }
};
