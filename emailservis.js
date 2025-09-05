const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBookingConfirmation = async (email, booking) => {
  const mailOptions = {
    from: `"HostelBook" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Booking Confirmation - HostelBook',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Booking Confirmation</h2>
        <p>Dear ${booking.user.firstName},</p>
        
        <p>Your booking has been confirmed!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>Booking Details</h3>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p><strong>Room:</strong> ${booking.room.roomNumber}</p>
          <p><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</p>
          <p><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</p>
          <p><strong>Total Amount:</strong> LKR ${booking.totalAmount}</p>
        </div>
        
        <p>Thank you for choosing HostelBook!</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendBookingConfirmation
};