import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export async function AccountLink() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <Link
        href="/account"
        className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        My account
      </Link>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
    >
      Sign in
    </Link>
  );
}
