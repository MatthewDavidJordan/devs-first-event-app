// utils/emails.ts
import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, nonce: string) {
  // Ensures this function is only run server-side
  if (typeof window !== "undefined") {
    throw new Error("This function should only run on the server");
  }

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/bootcamp/verify?email=${email}&nonce=${nonce}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "[ACTION REQUIRED] Verify your email request",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/wordlogo.png" alt="Event Logo" style="max-width: 200px; margin-bottom: 20px;" />
          </div>

          <h2 style="color: #007bff; text-align: center;">Thank you for being a part of our Hoya Developers Kickoff Contest!</h2>

          <p>Dear participant,</p>

          <p>We are thrilled that you have chosen to participate in our event! To ensure your submission is valid, please confirm your email by clicking the link below:</p>

          <p style="text-align: center;">
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #370F7E; text-decoration: none; border-radius: 5px;">
              Verify Your Email
            </a>
          </p>

          <p>By verifying your email, you will ensure that your submission is counted as a valid entry in the contest!</p>

          <p>If you have any questions or need further assistance, feel free to reach out to us at:</p>

          <p>
            <strong>Email:</strong> hoyadevelopers@gmail.com<br />
          </p>

          <p>We appreciate your participation!</p>

          <p>Best regards,<br>Hoya Developers Team</p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://hoyadevelopers.com" style="color: #007bff; text-decoration: none;">Visit our website</a>
          </div>
        </div>
      `,
    });

    console.log("Verification email sent:", info);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
