import nodemailer from 'nodemailer';

/**
 * Send an email using Nodemailer and Ethereal (for development testing).
 * Ethereal is a fake SMTP service that catches emails and gives you a link to view them.
 */
export const sendResetEmail = async (to, resetLink) => {
  try {
    // 1. Generate a test account on the fly
    // (In production, replace this with your real SMTP credentials)
    let testAccount = await nodemailer.createTestAccount();

    // 2. Create reusable transporter object using Ethereal
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // obtained from createTestAccount
        pass: testAccount.pass, // obtained from createTestAccount
      },
    });

    // 3. Setup email data
    let info = await transporter.sendMail({
      from: '"Web Gen AI" <noreply@webgenerator.com>',
      to, // array of receivers or comma-separated string
      subject: "Password Reset Request",
      text: `You requested a password reset. Please click on the following link within 15 minutes to reset your password: ${resetLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10b981;">Password Reset Request</h2>
          <p>We received a request to reset your password. If you didn't make this request, just ignore this email.</p>
          <p>Otherwise, you can reset your password using this link:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
          <hr style="border: 1px solid #eee; margin-top: 30px;"/>
          <p style="font-size: 12px; color: #888;">Web Generator Team</p>
        </div>
      `,
    });

    // 4. Log the Ethereal URL so the developer can click it and view the email!
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error("[EMAIL SERVICE] Error sending email:", error);
    throw new Error('Could not send reset email. Please try again later.');
  }
};
