// /app/api/bootcamp/submitNetID/route.ts
import { NextResponse } from "next/server";
import { getDbClient } from "@/utils/client";
import { sendVerificationEmail } from "@/utils/emails";

export async function POST(request: Request) {
  try {
    const { netid, team_name } = await request.json();

    // Validate input
    if (!netid || !team_name) {
      return NextResponse.json(
        { error: "netid and team_name are required" },
        { status: 400 }
      );
    }

    const email = netid.includes("@") ? netid : `${netid}@georgetown.edu`;
    const nonce = generateNonce(); // Implement a function to generate a unique nonce

    const supabase_client = getDbClient();

    // Look up the team_id based on the team_name
    const { data: teamData, error: teamError } = await supabase_client
      .from("teams")
      .select("id")
      .eq("name", team_name)
      .single();

    if (teamError) {
      console.error("Error fetching team_id:", teamError);
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }

    const team_id = teamData?.id;

    if (!team_id) {
      return NextResponse.json({ error: "Invalid team name" }, { status: 400 });
    }

    // Insert email, nonce, and team_id into the emails table
    const { data, error } = await supabase_client
      .from("emails")
      .insert({ email, team_id, nonce, confirmed: false })
      .select("*") // Explicitly select the data you just inserted
      .single();

    if (error) {
      console.error("Error inserting into database:", error);
      return NextResponse.json(
        { error: "Database insertion failed" },
        { status: 500 }
      );
    }

    // Send verification email
    await sendVerificationEmail(email, nonce);

    return NextResponse.json(
      {
        message: "Netid inserted and verification email sent successfully",
        email: data.email, // Now `data.email` should be available after the insertion
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

// Utility function to generate a unique nonce
function generateNonce(length: number = 16): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
