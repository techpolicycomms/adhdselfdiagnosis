import { createClient } from "@supabase/supabase-js";

/**
 * Server-only admin client. Uses service role key to bypass RLS.
 * Use only in API routes - never expose to the client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. Add them to .env.local"
    );
  }
  return createClient(url, key);
}
