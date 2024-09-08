// /app/api/bootcamp/submitNetID/route.ts
import { NextResponse } from "next/server";
import { insertEmail } from "@/lib/queries";
import { sendVerificationEmail } from "@/utils/emails";

//Handle POST request
export async function POST(request: Request) {
  try {
    const { netid, team_name } = await request.json();

    if (!netid || !team_name) {
      return NextResponse.json(
        { error: "netid and team_name are required" },
        { status: 400 }
      );
    }

    const result = await insertEmail(netid, team_name);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    if (result.email && result.nonce) {
      await sendVerificationEmail(result.email, result.nonce);
    }

    return NextResponse.json(
      {
        message: "Netid inserted and verification email sent successfully",
        email: result.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing submitNetID request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS requests from outside domains
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function generateNonce(length: number = 16): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
