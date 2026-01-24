import { createClient } from "@supabase/supabase-js";

// Check for Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Missing Supabase URL or Anon Key. Please check your .env file.",
  );
}

// Create and export client for usage in project
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
