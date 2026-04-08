import nodemailer from "nodemailer";

/**
 * Create reusable transporter
 */
const transporter = nodemailer.createTransport({
  service: "gmail", // You can switch to SendGrid, Resend later
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password (NOT real password)
  },
});

/**
 * Send Reset Password Email
 * @param {string} toEmail - User email
 * @param {string} resetLink - Full reset URL
 */
export const sendResetEmail = async (toEmail, resetLink) => {
  try {
    // Email HTML template
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset it:</p>
        
        <a href="${resetLink}" 
           style="display:inline-block;padding:10px 20px;
           background:#000;color:#fff;text-decoration:none;
           border-radius:5px;margin-top:10px;">
           Reset Password
        </a>

        <p style="margin-top:20px;">
          If you didn't request this, please ignore this email.
        </p>

        <p style="color:gray;font-size:12px;">
          This link will expire in 15 minutes.
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Web Generator" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Reset Your Password",
      html,
    });

    console.log("✅ Reset password email sent to:", toEmail);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send reset email");
  }
};