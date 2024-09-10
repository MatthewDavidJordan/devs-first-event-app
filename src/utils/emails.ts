// utils/emails.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendVerificationEmail(email: string, nonce: string) {
  // Ensures this function is only run server-side
  if (typeof window !== "undefined") {
    throw new Error("This function should only run on the server");
  }

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/bootcamp/verify?email=${email}&nonce=${nonce}`;

  const html = `<div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/wordlogo.png" alt="Event Logo" style="max-width: 200px; margin-bottom: 20px;" />
          </div>

          <h2 style="color: #007bff; text-align: center;">Thank you for being a part of our Hoya Developers Kickoff Contest!</h2>

          <p>Dear recipient,</p>

          <p>
            The team you just met is participating in the first ever Hoya Developers Bootcamp Launch Event!
            Their challenge is simple: build a website to collect as many unique netIds as possible before 10pm.
            By verifying your email, you will be counted towards the teams total emails -- you can monitor the teams progress [here](https://bootcamp.hoyadevelopers.com).
          </p>

          <p>
            To verify your submission, please confirm your netId by clicking the link below:
          </p>

          <p style="text-align: center;">
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #370F7E; text-decoration: none; border-radius: 5px;">
              Verify Your NetId
            </a>
          </p>

          <p>
            By verifying, you will NOT be added to a mailing list or have your email distributed. 
            This is just for our Hoya Developers Kickoff Event!
            If you have any questions or need further assistance, feel free to reach out to us at:
          </p>

          <p>
            <strong>Email:</strong> hoyadevelopers@gmail.com<br />
          </p>
          
          <p>Best regards,<br>Hoya Developers Team</p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://hoyadevelopers.com" style="color: #007bff; text-decoration: none;">Visit our website</a>
          </div>
        </div>
      `;
  try {
    const info = await resend.emails.send({
      from: "Hoya Devs <admin@bootcamp.hoyadevelopers.com>",
      to: [email],
      subject: "Verify Your Email for Hoya Developers Kickoff Contest",
      html,
    });

    console.log("Verification email sent:", info);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
