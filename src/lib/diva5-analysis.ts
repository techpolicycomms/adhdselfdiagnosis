/**
 * DIVA-5 / DSM-5 analysis logic
 * Threshold: 5+ symptoms in either domain (adults), 2+ impairment domains
 */

import {
  SYMPTOM_THRESHOLD,
  INATTENTION_QUESTIONS,
  HYPERACTIVITY_QUESTIONS,
} from "./adhd-questions";

export type PresentationType =
  | "inattentive"
  | "hyperactive"
  | "combined"
  | "below_threshold";

export interface AnalysisResult {
  inattentionCount: number;
  hyperactivityCount: number;
  presentation: PresentationType;
  meetsImpairment: boolean;
  meetsOnset: boolean;
  suspectedADHD: boolean;
  summary: string;
}

export function analyzeDiva5Responses(
  responses: Record<string, number>,
  impairmentDomains: string[],
  ageOfOnset: string | null
): AnalysisResult {
  const inattentionCount = INATTENTION_QUESTIONS.filter(
    (q) => (responses[q.id] ?? 0) >= SYMPTOM_THRESHOLD
  ).length;

  const hyperactivityCount = HYPERACTIVITY_QUESTIONS.filter(
    (q) => (responses[q.id] ?? 0) >= SYMPTOM_THRESHOLD
  ).length;

  let presentation: PresentationType = "below_threshold";
  if (inattentionCount >= 5 && hyperactivityCount >= 5) {
    presentation = "combined";
  } else if (inattentionCount >= 5) {
    presentation = "inattentive";
  } else if (hyperactivityCount >= 5) {
    presentation = "hyperactive";
  }

  const meetsImpairment = impairmentDomains.length >= 2;
  const meetsOnset = ageOfOnset === "yes";

  const suspectedADHD =
    presentation !== "below_threshold" && meetsImpairment && meetsOnset;

  let summary: string;
  if (presentation === "below_threshold") {
    summary =
      "Your responses do not meet the typical threshold for ADHD (5+ symptoms in either domain). This does not rule out ADHD—only a clinician can diagnose.";
  } else if (!meetsImpairment || !meetsOnset) {
    summary =
      "Your symptom pattern suggests possible ADHD, but a full assessment also considers impairment in 2+ life areas and symptoms before age 12. Consider discussing with a professional.";
  } else {
    const typeLabel =
      presentation === "combined"
        ? "Combined (inattentive + hyperactive/impulsive)"
        : presentation === "inattentive"
          ? "Predominantly Inattentive"
          : "Predominantly Hyperactive/Impulsive";
    summary = `Your responses suggest possible ${typeLabel} ADHD. This is not a diagnosis—see a qualified psychiatrist or specialist for a proper assessment.`;
  }

  return {
    inattentionCount,
    hyperactivityCount,
    presentation,
    meetsImpairment,
    meetsOnset,
    suspectedADHD,
    summary,
  };
}
