import { ScoreData, Teams, Emails, Team } from "@/models";
import { getDbClient } from "@/utils/client";
import { v4 as uuidv4 } from "uuid"; // For nonce generation
import { sendVerificationEmail } from "@/utils/emails"; // Function for sending verification email

// Load score data for teams
export async function loadScoreData(): Promise<number[]> {
  const supabase_client = await getDbClient();

  const loadScoreDataQuery = supabase_client
    .from("teams")
    .select(
      `
    name,
    emails:emails(count)
  `
    )
    .order("name");

  const { data, error } = await loadScoreDataQuery;

  if (error) {
    console.error("Error fetching score data:", error);
    return [];
  }

  if (!data) {
    return [];
  }

  const scores: number[] = data.map((team) => team.emails[0]?.count ?? 0);

  return scores;
}

// Load the list of teams
export async function loadTeams(): Promise<string[]> {
  const supabase_client = await getDbClient();

  const loadTeamsQuery = supabase_client
    .from("teams")
    .select("name")
    .order("name");

  const { data, error } = await loadTeamsQuery;

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  if (!data) {
    return [];
  }

  const teams: string[] = data.map((team) => team.name);

  return teams ?? [];
}

// Insert email into the database and send verification email
export async function insertEmail(netid: string, team_name: string) {
  const supabase_client = await getDbClient();

  // Check if netid contains '@', if not append @georgetown.edu
  const email = netid.includes("@") ? netid : `${netid}@georgetown.edu`;

  // Generate a unique nonce for email verification
  const nonce = uuidv4();

  // Look up the team_id based on the team_name
  const { data: teamData, error: teamError } = await supabase_client
    .from("teams")
    .select("id")
    .eq("name", team_name)
    .single();

  if (teamError) {
    console.error("Error fetching team_id:", teamError);
    return;
  }

  const team_id = teamData?.id;

  if (!team_id) {
    console.error("No team found with the specified name:", team_name);
    return;
  }

  // Insert the email, nonce, and confirmed status into the emails table
  const { data, error } = await supabase_client
    .from("emails")
    .insert([{ team_id, email, nonce, confirmed: false }]) // Insert nonce and set confirmed to false
    .select();

  if (error) {
    console.error("Error inserting email:", error);
    return;
  }

  console.log("Email inserted successfully:", data);

  // Send a verification email with the nonce and email
  await sendVerificationEmail(email, nonce); // Use the email sending utility
}
