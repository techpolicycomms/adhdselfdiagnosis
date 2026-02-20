/**
 * ASRS v1.1 6-Question Screener
 * Kessler, R.C., Adler, L., et al. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS).
 * Psychological Medicine, 35(2), 245-256
 * Copyright © New York University and President and Fellows of Harvard College.
 */

export const ASRS_RESPONSE_OPTIONS = [
  { value: 0, label: "Never", short: "Never" },
  { value: 1, label: "Rarely", short: "Rarely" },
  { value: 2, label: "Sometimes", short: "Sometimes" },
  { value: 3, label: "Often", short: "Often" },
  { value: 4, label: "Very Often", short: "Very Often" },
] as const;

export const ASRS_QUESTIONS = [
  {
    id: "q1",
    text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
  },
  {
    id: "q2",
    text: "How often do you have difficulty getting things in order when you have to do a task that requires organisation?",
  },
  {
    id: "q3",
    text: "How often do you have problems remembering appointments or obligations?",
  },
  {
    id: "q4",
    text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
  },
  {
    id: "q5",
    text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
  },
  {
    id: "q6",
    text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
  },
] as const;

export type ASRSResponse = (typeof ASRS_RESPONSE_OPTIONS)[number]["value"];
