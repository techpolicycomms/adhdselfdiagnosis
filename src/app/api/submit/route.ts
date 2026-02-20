import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SubmitPayload {
  anonymousId: string;
  asrsResponses?: Record<string, number>;
  diva5Responses?: Record<string, number>;
  impairmentDomains?: string[];
  ageOfOnset?: string;
  cookieData?: unknown;
  timestamp: string;
}

function sanitizeCookieData(data: unknown): unknown {
  if (!data || typeof data !== "object") return null;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeCookieItem(item)).filter(Boolean);
  }
  const obj = data as Record<string, unknown>;
  if (obj.cookies && Array.isArray(obj.cookies)) {
    return {
      cookies: obj.cookies.map((c: unknown) => sanitizeCookieItem(c)).filter(Boolean),
      domainCount: obj.cookies?.length ?? 0,
    };
  }
  return null;
}

function sanitizeCookieItem(item: unknown): Record<string, unknown> | null {
  if (!item || typeof item !== "object") return null;
  const c = item as Record<string, unknown>;
  return {
    domain: typeof c.domain === "string" ? c.domain : undefined,
    name: typeof c.name === "string" ? c.name : undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmitPayload;

    const hasResponses = body.diva5Responses || body.asrsResponses;
    if (!body.anonymousId || !hasResponses || !body.timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let sanitizedCookies: unknown = null;
    if (body.cookieData) {
      sanitizedCookies = sanitizeCookieData(body.cookieData);
    }

    const authClient = await createServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    const supabase = createAdminClient();
    const { error } = await supabase.from("submissions").insert({
      user_id: user?.id ?? null,
      anonymous_id: body.anonymousId,
      diva5_responses: body.diva5Responses ?? null,
      asrs_responses: body.asrsResponses ?? null,
      impairment_domains: body.impairmentDomains ?? [],
      age_of_onset: body.ageOfOnset ?? null,
      cookie_data: sanitizedCookies,
    });

    if (error) {
      console.error("Submit error:", error);
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }
}
