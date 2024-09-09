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
      subject: "Verify your email address",
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
    });

    console.log("Verification email sent:", info);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
