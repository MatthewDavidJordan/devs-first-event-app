import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, nonce: string) {
  const verificationLink =
    "${process.env.NEXT_PUBLIC_BASE_URL}/verify?email=${email}&nonce=${nonce}";

  try {
    const response = await resend.emails.send({
      from: "camjdaly@gmail.com", //replace with email we want to use
      to: email,
      subject: "Verify your email address",
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
    });

    // Log the response for successful email delivery
    console.log("Verification email sent:", response);
  } catch (error) {
    // If there's an error, log it to the console
    console.error("Error sending verification email:", error);
  }
}
