// api/submitNetID/route.ts
import { NextResponse } from "next/server";
import { insertEmail } from "@/lib/queries";

// Handle POST requests
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

    // Call the insertEmail function
    const result = await insertEmail(netid, team_name);

    // Handle errors from insertEmail
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Respond with success if the email was inserted and the email was sent
    return NextResponse.json(
      {
        message: "Netid inserted and verification email sent successfully",
        email: result.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS requests
export function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
