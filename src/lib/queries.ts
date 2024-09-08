// lib/queries.ts
import { getDbClient } from "@/utils/client";
import { v4 as uuidv4 } from "uuid"; // For nonce generation

// Function to load score data for teams
export async function loadScoreData(): Promise<number[]> {
  const supabase_client = await getDbClient();

  // Query to fetch team names and the count of emails associated with each team
  const { data, error } = await supabase_client
    .from("teams")
    .select("name, emails:emails(count)")
    .order("name");

  if (error) {
    console.error("Error fetching score data:", error);
    return [];
  }

  if (!data) {
    return [];
  }

  // Extract the scores (count of emails) for each team
  const scores: number[] = data.map((team: any) => team.emails[0]?.count ?? 0);

  return scores;
}

// Function to load the list of team names
export async function loadTeams(): Promise<string[]> {
  const supabase_client = await getDbClient();

  // Query to fetch the names of all teams
  const { data, error } = await supabase_client
    .from("teams")
    .select("name")
    .order("name");

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  if (!data) {
    return [];
  }

  // Return the list of team names
  const teams: string[] = data.map((team: any) => team.name);

  return teams;
}

// Function to insert email and generate nonce for email verification
export async function insertEmail(netid: string, team_name: string) {
  const supabase_client = await getDbClient();

  // Ensure the email has the correct format, appending @georgetown.edu if needed
  const email = netid.includes("@") ? netid : `${netid}@georgetown.edu`;

  // Generate a unique nonce for email verification
  const nonce = uuidv4();

  // Retrieve the team ID based on the provided team name
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

  if (!team_id) {
    console.error("No team found with the specified name:", team_name);
    return { error: "No team found" };
  }

  // Insert the email, nonce, and other details into the emails table
  const { data, error } = await supabase_client
    .from("emails")
    .insert([{ team_id, email, nonce, confirmed: false }])
    .select();

  if (error) {
    console.error("Error inserting email:", error);
    return { error: error.message };
  }

  console.log("Email inserted successfully:", data);

  // Return the relevant data without sending the verification email (handled elsewhere)
  return { success: true, email, nonce };
}
