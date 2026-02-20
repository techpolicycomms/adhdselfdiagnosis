/**
 * ADHD self-assessment questionnaire
 * Original questions paraphrased for general screening purposes.
 * This is not a clinical diagnostic tool—see a qualified professional for diagnosis.
 */

export const RESPONSE_OPTIONS = [
  { value: 0, label: "Never", short: "Never" },
  { value: 1, label: "Rarely", short: "Rarely" },
  { value: 2, label: "Sometimes", short: "Sometimes" },
  { value: 3, label: "Often", short: "Often" },
  { value: 4, label: "Very Often", short: "Very Often" },
] as const;

export type ResponseValue = (typeof RESPONSE_OPTIONS)[number]["value"];

/** Symptom present if response >= 3 (Often or Very Often) */
export const SYMPTOM_THRESHOLD = 3;

export const INATTENTION_QUESTIONS = [
  {
    id: "A1",
    text: "I tend to overlook small details or make slip-ups when doing tasks at work, school, or elsewhere.",
    examples: "e.g. missing typos, skipping errors in documents",
  },
  {
    id: "A2",
    text: "I often struggle to keep my focus on a single task or activity for very long.",
    examples: "e.g. my mind drifts, hard to stay engaged unless it really interests me",
  },
  {
    id: "A3",
    text: "When someone talks to me directly, I sometimes zone out or don’t fully take in what they said.",
    examples: "e.g. forgetting the conversation, needing things repeated",
  },
  {
    id: "A4",
    text: "I start projects or chores but frequently don’t finish them.",
    examples: "e.g. losing steam mid-task, switching to something else",
  },
  {
    id: "A5",
    text: "I find it hard to keep things organized—tasks, deadlines, or my physical space.",
    examples: "e.g. cluttered desk, poor time management, missing deadlines",
  },
  {
    id: "A6",
    text: "I tend to put off or avoid tasks that require sustained mental focus.",
    examples: "e.g. long forms, reports, or tasks that need deep concentration",
  },
  {
    id: "A7",
    text: "I often misplace things I need—keys, phone, wallet, documents.",
    examples: "e.g. spending time searching for items",
  },
  {
    id: "A8",
    text: "I get distracted easily by things around me or by my own thoughts.",
    examples: "e.g. noise, background activity, unrelated thoughts pulling me away",
  },
  {
    id: "A9",
    text: "I forget routine things—appointments, calls to make, bills to pay.",
    examples: "e.g. needing reminders or lists to stay on top of things",
  },
] as const;

export const HYPERACTIVITY_QUESTIONS = [
  {
    id: "B1",
    text: "I often tap my hands or feet, or find it hard to sit still without moving.",
  },
  {
    id: "B2",
    text: "I get up from my seat when I’m expected to stay seated (e.g. in meetings or lectures).",
  },
  {
    id: "B3",
    text: "I feel restless or have trouble winding down, like I’m always buzzing.",
  },
  {
    id: "B4",
    text: "I find it difficult to do quiet activities without getting antsy.",
  },
  {
    id: "B5",
    text: "I feel like I’m constantly on the move or need to be doing something.",
  },
  {
    id: "B6",
    text: "I tend to talk a lot—more than most people.",
  },
  {
    id: "B7",
    text: "I often answer before the other person has finished asking.",
  },
  {
    id: "B8",
    text: "I struggle to wait my turn in line or in conversations.",
  },
  {
    id: "B9",
    text: "I sometimes cut in or take over when others are speaking.",
  },
] as const;

export const IMPAIRMENT_DOMAINS = [
  { id: "imp_work", label: "Work or studies" },
  { id: "imp_relationships", label: "Relationships / family" },
  { id: "imp_social", label: "Social life" },
  { id: "imp_daily", label: "Daily life / self-care" },
  { id: "imp_leisure", label: "Leisure / hobbies" },
] as const;

export const AGE_OF_ONSET = {
  id: "onset",
  text: "Were some of these difficulties present before you turned 12 years old?",
  note: "ADHD is a childhood-onset condition; symptoms typically appear before age 12.",
} as const;

export const ALL_QUESTIONS = [
  ...INATTENTION_QUESTIONS,
  ...HYPERACTIVITY_QUESTIONS,
] as const;

export const SECTIONS = [
  {
    id: "inattention",
    title: "Part A: Inattention",
    description: "Over the past 6 months, how often have you experienced the following?",
    questions: INATTENTION_QUESTIONS,
  },
  {
    id: "hyperactivity",
    title: "Part B: Hyperactivity & Impulsivity",
    description: "Over the past 6 months, how often have you experienced the following?",
    questions: HYPERACTIVITY_QUESTIONS,
  },
] as const;
