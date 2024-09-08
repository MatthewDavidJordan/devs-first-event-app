//utils/client.ts
import { createClient } from "@supabase/supabase-js";

export const getDbClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
