/**
 * DIVA-5 / DSM-5 Based ADHD Self-Report Questionnaire
 *
 * Based on the Diagnostic Interview for ADHD in Adults (DIVA-5) and DSM-5 criteria.
 * DIVA Foundation: https://www.divacenter.eu/diva-5/what-is-diva-5/
 * DSM-5: American Psychiatric Association (2013)
 *
 * This covers all 18 symptoms in two domains: Inattention (A) and Hyperactivity-Impulsivity (B).
 * For adults: 5+ symptoms in either domain suggests possible ADHD presentation.
 * Threshold: "Often" or "Very Often" = symptom present.
 */

export const DIVA5_RESPONSE_OPTIONS = [
  { value: 0, label: "Never", short: "Never" },
  { value: 1, label: "Rarely", short: "Rarely" },
  { value: 2, label: "Sometimes", short: "Sometimes" },
  { value: 3, label: "Often", short: "Often" },
  { value: 4, label: "Very Often", short: "Very Often" },
] as const;

export type DIVA5Response = (typeof DIVA5_RESPONSE_OPTIONS)[number]["value"];

/** Symptom present if response >= 3 (Often or Very Often) */
export const DIVA5_SYMPTOM_THRESHOLD = 3;

export const DIVA5_INATTENTION = [
  {
    id: "A1",
    dsm: "A1",
    text: "I often fail to give close attention to details or make careless mistakes in work, school, or other activities.",
    examples: "e.g. missing details, typos, overlooking errors in documents",
  },
  {
    id: "A2",
    dsm: "A2",
    text: "I often have difficulty sustaining attention in tasks or activities (e.g. during meetings, lectures, or lengthy reading).",
    examples: "e.g. mind wanders, difficulty staying focused unless very interested",
  },
  {
    id: "A3",
    dsm: "A3",
    text: "I often do not seem to listen when spoken to directly (e.g. mind seems elsewhere, even in the absence of distraction).",
    examples: "e.g. forgetting what was said, needing things repeated",
  },
  {
    id: "A4",
    dsm: "A4",
    text: "I often do not follow through on instructions and fail to finish tasks, chores, or duties.",
    examples: "e.g. starting tasks but losing focus, not completing them",
  },
  {
    id: "A5",
    dsm: "A5",
    text: "I often have difficulty organizing tasks and activities (e.g. managing sequential tasks, keeping materials in order, meeting deadlines).",
    examples: "e.g. messy workspace, poor time management, missing deadlines",
  },
  {
    id: "A6",
    dsm: "A6",
    text: "I often avoid, dislike, or am reluctant to engage in tasks that require sustained mental effort.",
    examples: "e.g. lengthy forms, reports, or tasks requiring sustained focus",
  },
  {
    id: "A7",
    dsm: "A7",
    text: "I often lose things necessary for tasks or activities (e.g. keys, wallet, phone, documents).",
    examples: "e.g. misplacing items, spending time searching",
  },
  {
    id: "A8",
    dsm: "A8",
    text: "I am often easily distracted by extraneous stimuli or unrelated thoughts.",
    examples: "e.g. noise, background activity, own thoughts pulling focus",
  },
  {
    id: "A9",
    dsm: "A9",
    text: "I am often forgetful in daily activities (e.g. appointments, returning calls, paying bills).",
    examples: "e.g. forgetting obligations, needing reminders",
  },
] as const;

export const DIVA5_HYPERACTIVITY_IMPULSIVITY = [
  {
    id: "B1",
    dsm: "B1",
    text: "I often fidget with or tap my hands or feet, or squirm in my seat.",
  },
  {
    id: "B2",
    dsm: "B2",
    text: "I often leave my seat in situations when remaining seated is expected (e.g. in meetings or lectures).",
  },
  {
    id: "B3",
    dsm: "B3",
    text: "I often feel restless or unable to relax, as if driven by a motor.",
  },
  {
    id: "B4",
    dsm: "B4",
    text: "I often have difficulty engaging in leisure activities quietly.",
  },
  {
    id: "B5",
    dsm: "B5",
    text: "I am often \"on the go\" or acting as if \"driven by a motor\".",
  },
  {
    id: "B6",
    dsm: "B6",
    text: "I often talk excessively.",
  },
  {
    id: "B7",
    dsm: "B7",
    text: "I often blurt out an answer before a question has been completed.",
  },
  {
    id: "B8",
    dsm: "B8",
    text: "I often have difficulty waiting my turn.",
  },
  {
    id: "B9",
    dsm: "B9",
    text: "I often interrupt or intrude on others (e.g. butting into conversations or activities).",
  },
] as const;

export const DIVA5_IMPAIRMENT_DOMAINS = [
  { id: "imp_work", label: "Work or studies" },
  { id: "imp_relationships", label: "Relationships / family" },
  { id: "imp_social", label: "Social life" },
  { id: "imp_daily", label: "Daily life / self-care" },
  { id: "imp_leisure", label: "Leisure / hobbies" },
] as const;

export const DIVA5_AGE_OF_ONSET = {
  id: "onset",
  text: "Were some of these difficulties present before you turned 12 years old?",
  note: "ADHD is a childhood-onset disorder; symptoms typically appear before age 12.",
} as const;

export const DIVA5_ALL_QUESTIONS = [
  ...DIVA5_INATTENTION,
  ...DIVA5_HYPERACTIVITY_IMPULSIVITY,
] as const;

export const DIVA5_SECTIONS = [
  {
    id: "inattention",
    title: "Part A: Inattention",
    description: "Over the past 6 months, how often have you experienced the following?",
    questions: DIVA5_INATTENTION,
  },
  {
    id: "hyperactivity",
    title: "Part B: Hyperactivity & Impulsivity",
    description: "Over the past 6 months, how often have you experienced the following?",
    questions: DIVA5_HYPERACTIVITY_IMPULSIVITY,
  },
] as const;
