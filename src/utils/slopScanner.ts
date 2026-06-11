/**
 * Slop Reduction System Scanner Engine
 * Analyzes file contents for design and copy patterns matching "AI Slop".
 */

export interface SlopIssue {
  id: string;
  category: string;
  file: string;
  lineNumber: number;
  lineContent: string;
  reason: string;
  fix: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  severity: number; // contribution to score deduction
}

export interface CategoryScore {
  name: string;
  weight: number;
  score: number; // 0-100 (100 = perfect, 0 = pure slop)
  deduction: number;
}

export interface ScanResult {
  overallScore: number; // 0-100 (0 = perfect, 100 = heavy slop)
  categories: Record<string, CategoryScore>;
  issues: SlopIssue[];
  scannedFiles: string[];
}

const BUZZWORDS = [
  "seamless",
  "robust",
  "powerful",
  "cutting-edge",
  "game-changing",
  "unlock",
  "leverage",
  "delve",
  "tapestry",
  "revolutionize",
  "next-generation",
  "innovative",
  "fast-paced world",
];

const WEIGHTS = {
  visual: 25,
  typography: 10,
  layout: 15,
  copywriting: 15,
  ux: 10,
  designSystem: 10,
  brand: 10,
  motion: 5,
};

export function runSlopScan(files: Record<string, string>): ScanResult {
  const issues: SlopIssue[] = [];
  const scannedFiles = Object.keys(files);

  // Initialize scores
  const categories: Record<string, CategoryScore> = {
    visual: { name: "Visual Genericness", weight: WEIGHTS.visual, score: 100, deduction: 0 },
    typography: { name: "Typography Genericness", weight: WEIGHTS.typography, score: 100, deduction: 0 },
    layout: { name: "Layout Repetition", weight: WEIGHTS.layout, score: 100, deduction: 0 },
    copywriting: { name: "Copywriting Slop", weight: WEIGHTS.copywriting, score: 100, deduction: 0 },
    ux: { name: "Missing UX States", weight: WEIGHTS.ux, score: 100, deduction: 0 },
    designSystem: { name: "Design System Inconsistency", weight: WEIGHTS.designSystem, score: 100, deduction: 0 },
    brand: { name: "Lack of Brand Identity", weight: WEIGHTS.brand, score: 100, deduction: 0 },
    motion: { name: "Excessive Decoration (Motion)", weight: WEIGHTS.motion, score: 100, deduction: 0 },
  };

  // Helper to register an issue and deduct from category score
  const addIssue = (
    categoryKey: keyof typeof WEIGHTS,
    file: string,
    lineNumber: number,
    lineContent: string,
    reason: string,
    fix: string,
    priority: "HIGH" | "MEDIUM" | "LOW",
    pointsDeducted: number
  ) => {
    const cleanFile = file.replace(/^\.\.\/|^\.\.\/\.\.\//, "");
    issues.push({
      id: `${categoryKey}-${cleanFile}-${lineNumber}-${pointsDeducted}`,
      category: categories[categoryKey].name,
      file: cleanFile,
      lineNumber,
      lineContent: lineContent.trim(),
      reason,
      fix,
      priority,
      severity: pointsDeducted,
    });

    categories[categoryKey].deduction += pointsDeducted;
  };

  // Scan each file
  for (const [filePath, content] of Object.entries(files)) {
    const lines = content.split("\n");
    const isCss = filePath.endsWith(".css");
    const isTsx = filePath.endsWith(".tsx");
    const isHtml = filePath.endsWith(".html");

    // 1. Copywriting Scan (only inside Tsx or Html)
    if (isTsx || isHtml) {
      lines.forEach((line, index) => {
        // Skip imports and boilerplate lines
        if (line.trim().startsWith("import") || line.trim().startsWith("export")) return;

        BUZZWORDS.forEach((word) => {
          const regex = new RegExp(`\\b${word}\\b`, "i");
          if (regex.test(line)) {
            // Check if it's in a comment (if so, less priority/not user-facing)
            const isComment = line.trim().startsWith("//") || line.trim().includes("/*") || line.trim().startsWith("*");
            const points = isComment ? 1 : 4;
            addIssue(
              "copywriting",
              filePath,
              index + 1,
              line,
              `Found generic AI buzzword "${word}".`,
              isComment
                ? `Clean up code comments if possible, but verify it's not exposed to the user.`
                : `Replace abstract buzzword "${word}" with direct, specific terminology.`,
              isComment ? "LOW" : "HIGH",
              points
            );
          }
        });
      });
    }

    // 2. Visual Scan (Gradients, blurs, cards)
    if (isTsx || isCss) {
      // Keep track of gradient buttons and blur decoration density
      let gradientButtonCount = 0;
      let glowDecorCount = 0;
      let cardCount = 0;

      lines.forEach((line, index) => {
        // Gradient abuse check
        if (line.includes("bg-gradient-to-r") || line.includes("bg-gradient-to-tr") || line.includes("linear-gradient")) {
          // If it matches purple-to-blue styles
          if (
            (line.includes("purple") || line.includes("indigo") || line.includes("#B600A8")) &&
            (line.includes("blue") || line.includes("cyan") || line.includes("#7621B0"))
          ) {
            gradientButtonCount++;
            addIssue(
              "visual",
              filePath,
              index + 1,
              line,
              "Purple-to-blue style gradient decoration detected.",
              "Replace decorative gradients with solid background colors, spacing, and strong typography hierarchy.",
              "MEDIUM",
              4
            );
          }
        }

        // Glows and blur orb check
        if (line.includes("blur-3xl") || line.includes("blur-2xl") || line.includes("radial-gradient")) {
          glowDecorCount++;
          if (glowDecorCount > 2) {
            addIssue(
              "visual",
              filePath,
              index + 1,
              line,
              "Excessive radial glow / blurred background 'orb' decoration.",
              "Remove blurred visual clutter. Rely on grid alignment and whitespace for compositional structure.",
              "MEDIUM",
              3
            );
          }
        }

        // Cardification check
        if (line.includes("border-2") && line.includes("rounded-") && (line.includes("shadow-") || line.includes("bg-[#"))) {
          cardCount++;
          if (cardCount > 2) {
            addIssue(
              "visual",
              filePath,
              index + 1,
              line,
              "High density of card-bordered blocks ('Cardification Syndrome').",
              "Remove outer border cards. Use flat section groupings with ample whitespace to let content breathe.",
              "MEDIUM",
              3
            );
          }
        }

        // Spacing/radius inflation
        if (line.includes("rounded-[40px]") || line.includes("rounded-[50px]") || line.includes("rounded-[60px]")) {
          addIssue(
            "visual",
            filePath,
            index + 1,
            line,
            "Excessive border-radius inflation (toy-like soft rounded corners).",
            "Introduce sharper edges or reduce radius size hierarchy (e.g. 8px buttons, 16px cards, 24px dialogs).",
            "LOW",
            2
          );
        }
      });
    }

    // 3. Typography Scan
    if (isTsx || isCss) {
      lines.forEach((line, index) => {
        // Bold abuse: font-black or font-bold or <b> or <strong> inside paragraphs
        if (line.trim().startsWith("<p") || (line.includes("className=\"text-") && !line.includes("<h"))) {
          if (line.includes("font-black") || line.includes("font-bold") || line.includes("<strong>") || line.includes("<b>")) {
            addIssue(
              "typography",
              filePath,
              index + 1,
              line,
              "Heavy font weight styling (bold/black) inside generic body copy.",
              "Reserve bold text for semantic scanning and titles. Avoid decorative shouting in paragraphs.",
              "LOW",
              3
            );
          }
        }

        // Check for Inter or default sans
        if (isCss && line.includes("Inter")) {
          addIssue(
            "typography",
            filePath,
            index + 1,
            line,
            "Relying on generic geometric sans-serif (Inter) imported without editorial styling.",
            "Introduce a distinct Display typeface for headings, or pair with a high-tension Mono font.",
            "MEDIUM",
            4
          );
        }
      });
    }

    // 4. Design System Consistency
    if (isTsx) {
      lines.forEach((line, index) => {
        // Check for hardcoded hex colors in classes
        const hexMatch = line.match(/(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})/g);
        if (hexMatch && !filePath.includes("slopScanner") && !filePath.includes("SlopDiagnostics")) {
          // If it's hardcoded inline style or classes (e.g., bg-[#0C0C0C], border-[#D7E2EA])
          if (line.includes("bg-[#") || line.includes("text-[#") || line.includes("border-[#") || line.includes("shadow-[#")) {
            addIssue(
              "designSystem",
              filePath,
              index + 1,
              line,
              `Hardcoded hex color value "${hexMatch.join(", ")}" found in UI component.`,
              "Establish consistent Tailwind colors or CSS variables in your design tokens (e.g., var(--color-bg)).",
              "MEDIUM",
              3
            );
          }
        }
      });
    }

    // 5. UX Accessibility States
    if (isTsx) {
      lines.forEach((line, index) => {
        // Look for buttons, interactive text, nav items lacking focus rings
        if ((line.includes("<button") || line.includes("<a ") || line.includes("className=\"cursor-pointer")) &&
            !line.includes("focus:") && !line.includes("focus-visible:") &&
            !filePath.includes("SlopDiagnostics") && !filePath.includes("slopScanner")) {
          addIssue(
            "ux",
            filePath,
            index + 1,
            line,
            "Interactive element lacks keyboard focus indicator styling (missing focus: or focus-visible:).",
            "Always implement focus-visible outlines to support keyboard navigation access.",
            "HIGH",
            3
          );
        }
      });
    }

    // 6. Brand Absence & Constraints
    if (isTsx) {
      lines.forEach((line, index) => {
        // Placeholder check (figma.site, motionsites.ai, generic URLs)
        if (line.includes("figma.site") || line.includes("motionsites.ai") || line.includes("images.higgs.ai")) {
          addIssue(
            "brand",
            filePath,
            index + 1,
            line,
            "Using placeholder templates or asset hosting domains (e.g. motionsites.ai).",
            "Replace generic template placeholders with real local assets or production URL screenshots.",
            "MEDIUM",
            4
          );
        }
      });
    }

    // 7. Motion Slop
    if (isTsx) {
      let animationWrapperCount = 0;
      lines.forEach((line, index) => {
        // Only count opening tags
        if (line.includes("<FadeIn") || line.includes("<motion.div") || line.includes("<AnimatePresence")) {
          animationWrapperCount++;
        }
      });

      // If a single component file contains multiple fade-ins, deduct points
      if (animationWrapperCount > 5) {
        addIssue(
          "motion",
          filePath,
          1,
          `File has ${animationWrapperCount} animation wrappers.`,
          "Excessive decorative fade-in triggers ('Stagger/Fade Slop').",
          "Reduce ornamental motion. Motion should only communicate layout causality or important state change.",
          "LOW",
          4
        );
      }
    }
  }

  // Cap subscores at 0 (cannot be negative)
  Object.keys(categories).forEach((key) => {
    const cat = categories[key];
    cat.score = Math.max(0, 100 - (cat.deduction / cat.weight) * 100);
  });

  // Calculate final score
  let weightedDeductionTotal = 0;
  let weightSum = 0;

  Object.keys(categories).forEach((key) => {
    const cat = categories[key];
    weightedDeductionTotal += (100 - cat.score) * (cat.weight / 100);
    weightSum += cat.weight;
  });

  // Final Slop Score (0 = Distinct, 100 = Template Collapse)
  // Weighted average of the deductions
  const overallScore = Math.min(100, Math.round(weightedDeductionTotal));

  return {
    overallScore,
    categories,
    issues,
    scannedFiles,
  };
}
