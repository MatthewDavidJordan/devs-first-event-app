import { ScoreData, Teams, Emails, Team } from "@/models";
import { getDbClient } from "@/utils/client";

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

  // log each score one by one
  // scores.forEach((score) => {
  //   console.log(score);
  // });

  return scores;
}

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

  // log each team one by one
  teams.forEach((team) => {
    console.log(team);
  });

  return teams ?? [];
}

export async function insertEmail(email: string, team_id: string) {
  const supabase_client = await getDbClient();

  const { data, error } = await supabase_client
    .from("emails")
    .insert([{ team_id: team_id, email: email }])
    .select();
}
