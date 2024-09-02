import { Tables } from "@/lib/supabase";

// base types
export type Emails = Tables<"emails">;

export type Teams = Tables<"teams">;

// abstract types

export type ScoreData = {
  email_count: number;
};

export type Team = {
  team_name: string;
};
