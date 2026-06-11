/**
 * Slop Reduction System CLI Scanner Script
 * Run with: npx tsx scripts/slop-scan.ts
 */

import fs from "fs";
import path from "path";
import { runSlopScan } from "../src/utils/slopScanner";

const workspaceRoot = process.cwd();
const filesToScan = [
  "src/App.tsx",
  "src/index.css",
  "index.html",
  "src/components/HeroSection.tsx",
  "src/components/AboutSection.tsx",
  "src/components/ServicesSection.tsx",
  "src/components/ProjectsSection.tsx",
  "src/components/ContactFormModal.tsx",
  "src/components/Buttons.tsx",
  "src/components/FadeIn.tsx",
  "src/components/Magnet.tsx",
  "src/components/MarqueeSection.tsx",
];

function runCliScan() {
  console.log("\x1b[35m%s\x1b[0m", "==================================================");
  console.log("\x1b[35m%s\x1b[0m", "          SLOP REDUCTION SYSTEM SCANNER           ");
  console.log("\x1b[35m%s\x1b[0m", "==================================================");
  console.log("Analyzing local workspace files...\n");

  const filesMap: Record<string, string> = {};

  filesToScan.forEach((file) => {
    const fullPath = path.join(workspaceRoot, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      filesMap[file] = content;
    } else {
      console.warn(`\x1b[33mWarning: File not found: ${file}\x1b[0m`);
    }
  });

  const result = runSlopScan(filesMap);

  // Print Overall Score
  let scoreColor = "\x1b[32m"; // Green
  let ratingLabel = "Distinct";

  if (result.overallScore > 80) {
    scoreColor = "\x1b[31m"; // Red
    ratingLabel = "Template Collapse";
  } else if (result.overallScore > 60) {
    scoreColor = "\x1b[31m"; // Light Red/Orange
    ratingLabel = "Heavy Slop";
  } else if (result.overallScore > 40) {
    scoreColor = "\x1b[33m"; // Orange
    ratingLabel = "AI-Looking";
  } else if (result.overallScore > 20) {
    scoreColor = "\x1b[33m"; // Yellow
    ratingLabel = "Slightly Generic";
  }

  console.log(`OVERALL SLOP SCORE: ${scoreColor}${result.overallScore}/100\x1b[0m (${ratingLabel})`);
  console.log("--------------------------------------------------\n");

  // Print Categories
  console.log("CATEGORY BREAKDOWN:");
  Object.entries(result.categories).forEach(([key, cat]) => {
    let catColor = "\x1b[32m";
    if (cat.score < 50) catColor = "\x1b[31m";
    else if (cat.score < 80) catColor = "\x1b[33m";

    console.log(`- ${cat.name.padEnd(30)}: ${catColor}${Math.round(cat.score)}%\x1b[0m (Deduction: -${cat.deduction})`);
  });
  console.log("");

  // Print Issues
  console.log(`DETECTED PROBLEMS (${result.issues.length}):`);
  if (result.issues.length === 0) {
    console.log("\x1b[32m✔ No slop issues detected! Codebase is extremely clean.\x1b[0m");
  } else {
    result.issues.forEach((issue) => {
      let priorityColor = "\x1b[34m"; // Blue
      if (issue.priority === "HIGH") priorityColor = "\x1b[31m"; // Red
      if (issue.priority === "MEDIUM") priorityColor = "\x1b[33m"; // Yellow

      console.log(`\n\x1b[4m${issue.file}:${issue.lineNumber}\x1b[0m`);
      console.log(`  Reason:   \x1b[1m${issue.reason}\x1b[0m`);
      console.log(`  Code:     \x1b[36m${issue.lineContent}\x1b[0m`);
      console.log(`  Fix:      ${issue.fix}`);
      console.log(`  Priority: ${priorityColor}${issue.priority}\x1b[0m (Severity: -${issue.severity})`);
    });
  }

  console.log("\x1b[35m%s\x1b[0m", "\n==================================================");
  console.log(`Scanned ${Object.keys(filesMap).length} files.`);
  console.log("\x1b[35m%s\x1b[0m", "==================================================");
}

runCliScan();
