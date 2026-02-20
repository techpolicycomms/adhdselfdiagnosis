"use client";

import type { AnalysisResult } from "@/lib/diva5-analysis";

interface ResultsAnalysisProps {
  result: AnalysisResult;
  onContinue?: () => void;
  onSkipToFinish?: () => void;
  readOnly?: boolean;
}

const ADHD_CHECKLIST = [
  "Schedule an appointment with a psychiatrist, psychologist, or ADHD specialist",
  "Bring this self-assessment summary to your appointment",
  "Note which life areas are affected (work, relationships, etc.)",
  "Consider asking a parent or sibling about childhood symptoms",
  "Rule out other conditions (anxiety, depression, sleep disorders) with your clinician",
];

export function ResultsAnalysis({
  result,
  onContinue,
  onSkipToFinish,
  readOnly,
}: ResultsAnalysisProps) {
  const showChecklist = result.suspectedADHD || result.presentation !== "below_threshold";

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-stone-900">Your analysis</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">Inattention symptoms</p>
            <p className="text-2xl font-bold text-stone-900">
              {result.inattentionCount} / 9
            </p>
            <p className="text-xs text-stone-500">(5+ suggests possible ADHD)</p>
          </div>
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">Hyperactivity/Impulsivity</p>
            <p className="text-2xl font-bold text-stone-900">
              {result.hyperactivityCount} / 9
            </p>
            <p className="text-xs text-stone-500">(5+ suggests possible ADHD)</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <p className="font-medium text-amber-900">{result.summary}</p>
        </div>
      </div>

      {showChecklist && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-stone-900">
            Next steps if you suspect ADHD
          </h3>
          <ul className="mt-4 space-y-3">
            {ADHD_CHECKLIST.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {i + 1}
                </span>
                <span className="text-stone-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!readOnly && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onContinue}
            className="flex-1 rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white hover:bg-emerald-700"
          >
            Continue to cookie donation (optional)
          </button>
          {onSkipToFinish ? (
            <button
              onClick={onSkipToFinish}
              className="rounded-xl border border-stone-300 py-4 px-6 font-medium text-stone-700 hover:bg-stone-50"
            >
              Skip to finish
            </button>
          ) : (
            <a
              href="/"
              className="rounded-xl border border-stone-300 py-4 px-6 text-center font-medium text-stone-700 hover:bg-stone-50"
            >
              Skip to finish
            </a>
          )}
        </div>
      )}
    </div>
  );
}
