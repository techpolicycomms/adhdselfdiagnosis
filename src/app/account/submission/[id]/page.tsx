import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { analyzeDiva5Responses } from "@/lib/diva5-analysis";
import { ResultsAnalysis } from "@/components/ResultsAnalysis";
import { SelfAssessmentCertificate } from "@/components/SelfAssessmentCertificate";
import type { ResponseValue } from "@/lib/adhd-questions";

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/account");
  }

  const { data: sub, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !sub) {
    notFound();
  }

  const responses = (sub.diva5_responses as Record<string, ResponseValue>) ?? {};
  const impairmentDomains = (sub.impairment_domains as string[]) ?? [];
  const ageOfOnset = sub.age_of_onset as string | null;
  const result = analyzeDiva5Responses(responses, impairmentDomains, ageOfOnset);
  const date = new Date(sub.created_at).toLocaleDateString(undefined, {
    dateStyle: "long",
  });

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/account"
          className="mb-8 inline-flex items-center gap-2 text-stone-600 hover:text-stone-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to account
        </Link>

        <p className="text-sm text-stone-500">{date}</p>
        <h1 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
          Your self-assessment results
        </h1>

        <div className="mt-8">
          <ResultsAnalysis result={result} readOnly />
        </div>

        <div className="mt-12">
          <SelfAssessmentCertificate result={result} />
        </div>

        <div className="mt-10">
          <Link
            href="/account"
            className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Back to account
          </Link>
        </div>
      </div>
    </div>
  );
}
