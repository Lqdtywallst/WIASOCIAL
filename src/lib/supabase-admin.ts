import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function getSupabaseForUser(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!serviceRoleKey || serviceRoleKey.includes("your_supabase")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY required for server operations");
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
