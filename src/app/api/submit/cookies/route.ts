import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CookiesPayload {
  anonymousId: string;
  cookieData: unknown;
}

function sanitizeCookieItem(item: unknown): Record<string, unknown> | null {
  if (!item || typeof item !== "object") return null;
  const c = item as Record<string, unknown>;
  return {
    domain: typeof c.domain === "string" ? c.domain : undefined,
    name: typeof c.name === "string" ? c.name : undefined,
  };
}

function sanitizeCookieData(data: unknown): unknown {
  if (!data || typeof data !== "object") return null;
  if (Array.isArray(data)) {
    return data.map(sanitizeCookieItem).filter((x): x is Record<string, unknown> => x !== null);
  }
  const obj = data as Record<string, unknown>;
  if (obj.cookies && Array.isArray(obj.cookies)) {
    const sanitized = obj.cookies.map(sanitizeCookieItem).filter((x): x is Record<string, unknown> => x !== null);
    return { cookies: sanitized, count: sanitized.length };
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CookiesPayload;

    if (!body.anonymousId || !body.cookieData) {
      return NextResponse.json(
        { error: "Missing anonymousId or cookieData" },
        { status: 400 }
      );
    }

    const sanitized = sanitizeCookieData(body.cookieData);
    const authClient = await createServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    const supabase = createAdminClient();
    // Find submission by anonymous_id (and user_id if logged in)
    let query = supabase
      .from("submissions")
      .select("id")
      .eq("anonymous_id", body.anonymousId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (user) {
      query = query.eq("user_id", user.id);
    } else {
      query = query.is("user_id", null);
    }

    const { data: rows, error: findError } = await query;

    if (findError || !rows?.length) {
      return NextResponse.json(
        { error: "Contribution not found. Complete the questionnaire first." },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ cookie_data: sanitized })
      .eq("id", rows[0].id);

    if (updateError) {
      console.error("Cookies update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save cookies" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cookies submit error:", err);
    return NextResponse.json(
      { error: "Failed to save cookies" },
      { status: 500 }
    );
  }
}
