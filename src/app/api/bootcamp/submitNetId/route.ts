import { NextResponse } from "next/server";
import { insertEmail } from "@/lib/queries";

// Handle POST requests
export async function POST(request: Request) {
  try {
    const { netid, team_name } = await request.json();

    // Validate input
    if (!netid || !team_name) {
      const response = NextResponse.json(
        { error: "netid and team_name are required" },
        { status: 400 }
      );
      return response;
    }

    // Call the insertEmail function
    await insertEmail(netid, team_name);

    const response = NextResponse.json(
      { message: "Netid inserted successfully" },
      { status: 201 }
    );
    return response;
  } catch (error) {
    console.error("Error processing request:", error);

    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    return response;
  }
}

// Handle preflight OPTIONS requests from outside domains
export function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return response;
}
