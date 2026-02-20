"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { ProgressBar } from "@/components/ProgressBar";
import {
  SECTIONS,
  ALL_QUESTIONS,
  RESPONSE_OPTIONS,
  IMPAIRMENT_DOMAINS,
  AGE_OF_ONSET,
  type ResponseValue,
} from "@/lib/adhd-questions";
import { analyzeDiva5Responses } from "@/lib/diva5-analysis";
import { generateAnonymousId } from "@/lib/anonymize";
import { ResultsAnalysis } from "@/components/ResultsAnalysis";
import { SelfAssessmentCertificate } from "@/components/SelfAssessmentCertificate";

type Step = "intro" | "questions" | "impairment" | "onset" | "results" | "cookies" | "done";

const TOTAL_QUESTION_STEPS = ALL_QUESTIONS.length;
const TOTAL_STEPS = TOTAL_QUESTION_STEPS + 2; // + impairment + onset

function DonateContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, ResponseValue>>({});
  const [impairmentDomains, setImpairmentDomains] = useState<string[]>([]);
  const [ageOfOnset, setAgeOfOnset] = useState<string | null>(null);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [cookieFile, setCookieFile] = useState<unknown>(null);
  const [cookieFileName, setCookieFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idFromUrl = searchParams.get("id");

  useEffect(() => {
    if (idFromUrl && step === "cookies") {
      setAnonymousId(idFromUrl);
    }
  }, [idFromUrl, step]);

  const handleResponse = useCallback((questionId: string, value: ResponseValue) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleImpairmentToggle = useCallback((id: string) => {
    setImpairmentDomains((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const currentSection = SECTIONS.find((s) =>
    s.questions.some((q) => q.id === ALL_QUESTIONS[currentQuestion]?.id)
  );

  const handleNextQuestion = useCallback(async () => {
    if (currentQuestion < TOTAL_QUESTION_STEPS - 1) {
      setCurrentQuestion((c) => c + 1);
    } else {
      setStep("impairment");
    }
  }, [currentQuestion]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((c) => c - 1);
    } else {
      setStep("intro");
    }
  }, [currentQuestion]);

  const handleFromImpairment = useCallback(() => {
    setStep("onset");
  }, []);

  const handleFromOnset = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    const id = generateAnonymousId();
    setAnonymousId(id);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          anonymousId: id,
          diva5Responses: responses,
          impairmentDomains,
          ageOfOnset,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string }).error || `Failed to save (${res.status})`
        );
      }
      setStep("results");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(
        `${msg}. Please ensure you're connected and try again. If the problem persists, sign in to save your results.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [responses, impairmentDomains, ageOfOnset]);

  const handleCookieUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          const parsed = JSON.parse(text);
          setCookieFile(parsed);
          setCookieFileName(file.name);
        } catch {
          setError("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const handleFromResults = useCallback(() => {
    setStep("cookies");
    if (anonymousId) {
      window.history.replaceState(null, "", `/donate?step=cookies&id=${anonymousId}`);
    }
  }, [anonymousId]);

  const handleSkipToFinish = useCallback(() => {
    setStep("done");
  }, []);

  const handleFinish = useCallback(async () => {
    if (cookieFile && anonymousId) {
      setIsSubmitting(true);
      setError(null);
      try {
        const res = await fetch("/api/submit/cookies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            anonymousId,
            cookieData: cookieFile,
          }),
        });
        if (!res.ok) throw new Error("Failed to add cookies");
      } catch {
        setError("Could not add cookies. Your answers were saved.");
      } finally {
        setIsSubmitting(false);
      }
    }
    setStep("done");
  }, [anonymousId, cookieFile]);

  const currentQ = ALL_QUESTIONS[currentQuestion];
  const canProceedFromQuestions = currentQ && responses[currentQ.id] !== undefined;

  const extensionInstallUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/extension/install`
      : "/extension/install";

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-stone-600 hover:text-stone-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {step === "intro" && (
          <div className="space-y-8">
            <PrivacyBadge />
            <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
              Contribute to ADHD research
            </h1>
            <p className="text-lg text-stone-600">
              Complete our ADHD self-assessment questionnaire. Then optionally donate your
              cookie patterns for research.
              Sign in to save your results to your account, or stay anonymous.
            </p>
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-semibold text-stone-900">What you&apos;ll do:</h3>
              <ol className="mt-4 space-y-3 text-stone-600">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">1</span>
                  Answer 18 symptom questions + impairment (~8 min)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">2</span>
                  Install our extension (one-time, ~1 min)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">3</span>
                  Click &quot;Donate&quot; in the extension (~10 sec)
                </li>
              </ol>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-900">
              <strong>Note:</strong> This is a research tool, not a diagnosis. Results
              are for dataset building. Seek a clinician for formal assessment.
            </div>
            <button
              onClick={() => setStep("questions")}
              className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto sm:px-12"
            >
              Start questionnaire
            </button>
          </div>
        )}

        {step === "questions" && currentQ && (
          <div className="space-y-8">
            <ProgressBar current={currentQuestion + 1} total={TOTAL_QUESTION_STEPS} />
            {currentSection && (
              <div className="rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2 text-sm font-medium text-stone-700">
                {currentSection.title}
              </div>
            )}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-medium text-emerald-700">
                Over the past 6 months...
              </p>
              <h2 className="mt-4 text-xl font-semibold text-stone-900">
                {currentQ.text}
              </h2>
              {"examples" in currentQ && currentQ.examples && (
                <p className="mt-2 text-sm text-stone-500">{currentQ.examples}</p>
              )}
              <div className="mt-6 space-y-3">
                {RESPONSE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                      responses[currentQ.id] === opt.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQ.id}`}
                      value={opt.value}
                      checked={responses[currentQ.id] === opt.value}
                      onChange={() => handleResponse(currentQ.id, opt.value)}
                      className="h-4 w-4 border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-stone-800">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handlePrevQuestion}
                  className="rounded-xl border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={!canProceedFromQuestions}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion < TOTAL_QUESTION_STEPS - 1 ? "Next" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "impairment" && (
          <div className="space-y-8">
            <ProgressBar current={TOTAL_QUESTION_STEPS + 1} total={TOTAL_STEPS} />
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-stone-900">
                Do these difficulties cause problems in your life?
              </h2>
              <p className="mt-2 text-stone-600">
                Select all areas where your symptoms have caused significant impairment
                (DSM-5 requires problems in 2+ areas for diagnosis).
              </p>
              <div className="mt-6 space-y-3">
                {IMPAIRMENT_DOMAINS.map((d) => (
                  <label
                    key={d.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                      impairmentDomains.includes(d.id)
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={impairmentDomains.includes(d.id)}
                      onChange={() => handleImpairmentToggle(d.id)}
                      className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-stone-800">{d.label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep("questions")}
                  className="rounded-xl border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  onClick={handleFromImpairment}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "onset" && (
          <div className="space-y-8">
            <ProgressBar current={TOTAL_QUESTION_STEPS + 2} total={TOTAL_STEPS} />
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-stone-900">
                {AGE_OF_ONSET.text}
              </h2>
              <p className="mt-2 text-sm text-stone-500">{AGE_OF_ONSET.note}</p>
              <div className="mt-6 space-y-3">
                {["yes", "no", "unsure"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                      ageOfOnset === opt
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="onset"
                      value={opt}
                      checked={ageOfOnset === opt}
                      onChange={() => setAgeOfOnset(opt)}
                      className="h-4 w-4 border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-stone-800 capitalize">{opt}</span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep("impairment")}
                  className="rounded-xl border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  onClick={handleFromOnset}
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Continue"}
                </button>
              </div>
              {error && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-red-600">{error}</p>
                  <p className="text-xs text-stone-500">
                    Tip: Sign in first to save your assessment to your account.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="font-medium text-emerald-800">✓ Your answers have been saved.</p>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
              Your free analysis
            </h1>
            <ResultsAnalysis
              result={analyzeDiva5Responses(responses, impairmentDomains, ageOfOnset)}
              onContinue={handleFromResults}
              onSkipToFinish={handleSkipToFinish}
            />
          </div>
        )}

        {step === "cookies" && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="font-medium text-emerald-800">✓ Your answers have been saved.</p>
              <p className="mt-1 text-sm text-emerald-700">
                Optionally add cookie patterns to strengthen the research.
              </p>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                Donate cookie patterns (optional)
              </h1>
              <p className="mt-2 text-stone-600">
                Our extension reads cookie domain/name patterns only—values are never sent.
              </p>
            </div>
            <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-xl border border-stone-200 bg-stone-50/50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">1</span>
                  <div>
                    <h3 className="font-semibold text-stone-900">Install the extension</h3>
                    <a href={extensionInstallUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                      How to install <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-xl border border-stone-200 bg-stone-50/50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">2</span>
                  <div>
                    <h3 className="font-semibold text-stone-900">Click the extension icon</h3>
                    <p className="mt-1 text-sm text-stone-600">Click &quot;Donate cookie patterns&quot;.</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-stone-200 pt-6">
                <p className="mb-4 text-sm text-stone-500">Or upload a cookie JSON file</p>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/50 py-8 transition-colors hover:border-emerald-400 hover:bg-emerald-50/30">
                  <input type="file" accept=".json" onChange={handleCookieUpload} className="hidden" />
                  {cookieFileName ? <p className="font-medium text-emerald-700">✓ {cookieFileName}</p> : <><svg className="mx-auto h-10 w-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3v12" /></svg><p className="mt-2 text-sm font-medium text-stone-700">Upload JSON file</p></>}
                </label>
              </div>
              <button onClick={handleFinish} disabled={isSubmitting} className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {isSubmitting ? "Adding cookies..." : "I'm done — finish"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-stone-900">Thank you</h1>
              <p className="mt-2 text-stone-600">
                Your self-assessment has been saved. Here is your certificate to bring to a psychiatrist or specialist.
              </p>
            </div>

            <SelfAssessmentCertificate
              result={analyzeDiva5Responses(responses, impairmentDomains, ageOfOnset)}
            />

            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-bold text-stone-900">ADHD resources</h3>
              <p className="mt-1 text-sm text-stone-600">
                Podcasts and channels that can help you learn more about ADHD.
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="https://www.youtube.com/@ADHD_Chatter_Podcast" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:text-emerald-700">
                    ADHD Chatter
                  </a>
                  <span className="ml-2 text-stone-500">— YouTube channel</span>
                </li>
                <li>
                  <a href="https://www.youtube.com/@HowtoADHD" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:text-emerald-700">
                    How to ADHD
                  </a>
                  <span className="ml-2 text-stone-500">— YouTube channel</span>
                </li>
                <li>
                  <a href="https://www.understood.org/en/articles/adhd-explained-a-28-minute-primer" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:text-emerald-700">
                    ADHD Explained (Understood)
                  </a>
                  <span className="ml-2 text-stone-500">— 28-min primer video</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Link href="/" className="inline-flex rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white hover:bg-emerald-700">Return home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#faf9f6]"><p className="text-stone-500">Loading...</p></div>}>
      <DonateContent />
    </Suspense>
  );
}
