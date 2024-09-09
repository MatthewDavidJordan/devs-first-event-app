// lib/queries.ts
import { getDbClient } from "@/utils/client";
import { v4 as uuidv4 } from "uuid"; // For nonce generation

export async function loadScoreData(): Promise<number[]> {
  const supabase_client = await getDbClient();
  const { data, error } = await supabase_client
    .from("teams")
    .select("name, emails:emails(count)")
    .eq("emails.confirmed", true) // Filter to only load confirmed emails
    .order("name");

  if (error) {
    console.error("Error fetching score data:", error);
    return [];
  }

  if (!data) return [];

  const scores: number[] = data.map((team: any) => team.emails[0]?.count ?? 0);
  return scores;
}

export async function loadTeams(): Promise<string[]> {
  const supabase_client = await getDbClient();
  const { data, error } = await supabase_client
    .from("teams")
    .select("name")
    .order("name");

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  if (!data) return [];

  const teams: string[] = data.map((team: any) => team.name);
  return teams;
}

/// Insert email into database, checks if Netid is an email, and ensures it ends with @georgetown.edu
export async function insertEmail(netid: string, team_name: string) {
  const supabase_client = await getDbClient();

  // Normalize the email to ensure it always ends with '@georgetown.edu'
  let email: string;
  if (netid.includes("@")) {
    // If there's an '@', make sure the domain is correct
    email = `${netid.split("@")[0]}@georgetown.edu`; // Always use 'georgetown.edu' as the domain
  } else {
    // If no '@' is present, append '@georgetown.edu'
    email = `${netid}@georgetown.edu`;
  }

  const nonce = uuidv4();

  // Look up team_id by team_name
  const { data: teamData, error: teamError } = await supabase_client
    .from("teams")
    .select("id")
    .eq("name", team_name)
    .single();

  if (teamError) {
    console.error("Error fetching team_id:", teamError);
    return { error: teamError.message };
  }

  const team_id = teamData?.id;
  if (!team_id) return { error: "No team found" };

  // Insert email into database
  const { data, error } = await supabase_client
    .from("emails")
    .insert([{ team_id, email, nonce, confirmed: false }])
    .select();

  if (error) {
    console.error("Error inserting email:", error);
    return { error: error.message };
  }

  console.log("Email inserted successfully:", data);
  return { success: true, email, nonce };
}
