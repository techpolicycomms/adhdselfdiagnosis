"use client";

import { useRef } from "react";
import type { AnalysisResult } from "@/lib/diva5-analysis";

interface SelfAssessmentCertificateProps {
  result: AnalysisResult;
}

export function SelfAssessmentCertificate({ result }: SelfAssessmentCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const presentationLabel =
    result.presentation === "combined"
      ? "Combined (Inattentive + Hyperactive/Impulsive)"
      : result.presentation === "inattentive"
        ? "Predominantly Inattentive"
        : result.presentation === "hyperactive"
          ? "Predominantly Hyperactive/Impulsive"
          : "Below threshold";

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-xl bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h12z" />
        </svg>
        Print / Save as PDF
      </button>

      <div
        ref={certRef}
        className="rounded-2xl border-2 border-stone-300 bg-white p-8 shadow-lg print:border-stone-400 print:shadow-none"
      >
        <div className="border-b-2 border-stone-200 pb-6">
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            ADHD Self-Assessment Certificate
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            This document summarizes your self-assessment results. It is not a
            medical diagnosis.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-stone-500">Inattention symptoms</p>
              <p className="text-xl font-bold text-stone-900">
                {result.inattentionCount} / 9
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Hyperactivity/Impulsivity</p>
              <p className="text-xl font-bold text-stone-900">
                {result.hyperactivityCount} / 9
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-stone-500">Assessment result</p>
            <p className="font-semibold text-stone-900">{presentationLabel}</p>
          </div>

          <div>
            <p className="text-sm text-stone-500">Date completed</p>
            <p className="font-medium text-stone-900">{date}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 print:bg-amber-50/80">
          <h3 className="font-semibold text-amber-900">Important disclaimer</h3>
          <p className="mt-2 text-sm text-amber-900">
            This certificate reflects a self-administered screening only. It
            does not constitute a medical or psychiatric diagnosis. Only a
            qualified psychiatrist, psychologist, or other licensed clinician
            can diagnose ADHD. Use this summary to prepare for an appointment
            with a mental health professional—it may help you discuss your
            experiences and decide whether a formal evaluation is appropriate.
          </p>
        </div>
      </div>
    </div>
  );
}
