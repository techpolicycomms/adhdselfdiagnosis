#!/usr/bin/env node
/**
 * Count total donations (submissions) in data/submissions/
 * Run from project root: node scripts/count-donations.js
 */

import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "submissions");
if (!fs.existsSync(dir)) {
  console.log("0 donations (no submissions folder yet)");
  process.exit(0);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
const withCookies = files.filter((f) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    return data.cookieData && (data.cookieData.cookies?.length > 0 || data.cookieData.count > 0);
  } catch {
    return false;
  }
});

const withDiva5 = files.filter((f) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    return data.diva5Responses && Object.keys(data.diva5Responses).length > 0;
  } catch {
    return false;
  }
});

console.log(`Total donations: ${files.length}`);
console.log(`With DIVA-5 questionnaire: ${withDiva5.length}`);
console.log(`With cookie data: ${withCookies.length}`);
console.log(`Questionnaire only: ${files.length - withCookies.length}`);
