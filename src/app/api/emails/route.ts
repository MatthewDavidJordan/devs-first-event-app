import { NextResponse } from "next/server";
import { insertEmail } from "@/lib/queries";

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
    await insertEmail(netid, team_name);

    // Create response with CORS headers
    const response = NextResponse.json(
      { message: "Netid inserted successfully" },
      { status: 201 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error processing request:", error);

    // Create error response with CORS headers
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  }
}

// Handle preflight OPTIONS requests
export function OPTIONS() {
  const response = NextResponse.json({}, { status: 204 });

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}
