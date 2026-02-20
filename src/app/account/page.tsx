import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { analyzeDiva5Responses } from "@/lib/diva5-analysis";
import type { ResponseValue } from "@/lib/adhd-questions";

export default async function AccountPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/account");
  }

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Sign out
            </button>
          </form>
        </div>

        <h1 className="text-3xl font-bold text-stone-900">Your account</h1>
        <p className="mt-2 text-stone-600">
          Your saved self-assessments. You can take another assessment anytime.
        </p>

        <div className="mt-8 space-y-6">
          {!submissions?.length ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
              <p className="text-stone-600">No assessments yet.</p>
              <Link
                href="/donate"
                className="mt-4 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Take your first assessment
              </Link>
            </div>
          ) : (
            submissions.map((sub) => {
              const responses = (sub.diva5_responses as Record<string, ResponseValue>) ?? {};
              const impairmentDomains = (sub.impairment_domains as string[]) ?? [];
              const ageOfOnset = sub.age_of_onset as string | null;
              const result = analyzeDiva5Responses(responses, impairmentDomains, ageOfOnset);
              const date = new Date(sub.created_at).toLocaleDateString(undefined, {
                dateStyle: "medium",
              });

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-stone-900">{date}</p>
                      <p className="mt-1 text-sm text-stone-600">{result.summary}</p>
                      <p className="mt-2 text-xs text-stone-500">
                        {result.inattentionCount} inattention · {result.hyperactivityCount}{" "}
                        hyperactivity · {result.presentation}
                      </p>
                    </div>
                    <Link
                      href={`/account/submission/${sub.id}`}
                      className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-10">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Take new assessment
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
