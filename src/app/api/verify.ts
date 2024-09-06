// api/verify/route.ts
import { NextResponse } from "next/server";
import { getDbClient } from "@/utils/client";

export async function GET(request: Request) {
  const supabase_client = getDbClient();

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const nonce = searchParams.get("nonce");

  if (!email || !nonce) {
    return NextResponse.json(
      { error: "Missing email or nonce" },
      { status: 400 }
    );
  }

  // Check if the email and nonce match an entry in the database
  const { data, error } = await supabase_client
    .from("emails")
    .select("id, confirmed")
    .eq("email", email)
    .eq("nonce", nonce)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Invalid email or nonce" },
      { status: 400 }
    );
  }

  // Check if the email is already verified
  if (data.confirmed) {
    return NextResponse.json(
      { message: "Email is already verified" },
      { status: 400 }
    );
  }

  // Update the confirmed field to true
  const { error: updateError } = await supabase_client
    .from("emails")
    .update({ confirmed: true })
    .eq("email", email);

  if (updateError) {
    return NextResponse.json(
      { error: "Error updating confirmation status" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Email verified successfully" },
    { status: 200 }
  );
}
