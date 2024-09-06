import { Tables } from "@/lib/supabase";

// base types
export type Emails = Tables<"emails"> & {
  nonce: string; // New field for verification nonce
  confirmed: boolean; // New field to track if the email is verified
};

export type Teams = Tables<"teams">;

// abstract types
export type ScoreData = {
  email_count: number;
};

export type Team = {
  team_name: string;
};
