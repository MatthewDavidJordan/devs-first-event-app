// utils/emails.ts
import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, nonce: string) {
  // Verify that this function runs on the server only
  if (typeof window !== "undefined") {
    throw new Error("sendVerificationEmail should only be run on the server");
  }

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/bootcamp/verify?email=${email}&nonce=${nonce}`;

  // Set up Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can replace with other email services like Outlook, etc.
    auth: {
      user: process.env.GMAIL_USER, // Replace with your email
      pass: process.env.GMAIL_PASS, // Replace with your email password or app-specific password
    },
  });

  try {
    // Send the email
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER, // Sender address
      to: email, // Receiver address
      subject: "Verify your email address",
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
    });

    // Log the response for successful email delivery
    console.log("Verification email sent:", info);
  } catch (error) {
    // If there's an error, log it to the console
    console.error("Error sending verification email:", error);
  }
}
