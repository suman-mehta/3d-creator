import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { runSlopScan, ScanResult, SlopIssue } from "../utils/slopScanner";
import {
  AlertTriangle,
  X,
  Code,
  Shield,
  Zap,
  Info,
  RefreshCw,
  Sliders,
  ChevronDown,
  Layout,
  Type,
  Maximize2,
  FileCode,
  Flame,
  CheckCircle,
  Play
} from "lucide-react";

export default function SlopDiagnostics() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Vite raw glob import - reads files live at build/dev time
  const fetchRawFiles = () => {
    try {
      const rawModules = import.meta.glob(
        [
          "./*.tsx",
          "../App.tsx",
          "../index.css",
          "../../index.html"
        ],
        { query: "?raw", eager: true }
      ) as Record<string, { default: string }>;

      const filesMap: Record<string, string> = {};
      for (const [path, module] of Object.entries(rawModules)) {
        // Clean path to show clean names
        const cleanPath = path
          .replace(/^\.\//, "src/components/")
          .replace(/^\.\.\/App\.tsx/, "src/App.tsx")
          .replace(/^\.\.\/index\.css/, "src/index.css")
          .replace(/^\.\.\/\.\.\/index\.html/, "index.html");
        filesMap[cleanPath] = module.default;
      }
      return filesMap;
    } catch (e) {
      console.error("Failed to glob raw files in browser:", e);
      return {};
    }
  };

  const triggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      const files = fetchRawFiles();
      const result = runSlopScan(files);
      setScanResult(result);
      setScanning(false);
    }, 450);
  };

  useEffect(() => {
    triggerScan();
  }, []);

  if (!scanResult) return null;

  const getScoreRating = (score: number) => {
    if (score <= 20) return { label: "Distinct", color: "#22C55E", desc: "Authorship & System Coherence intact." };
    if (score <= 40) return { label: "Slightly Generic", color: "#EAB308", desc: "A few template habits found." };
    if (score <= 60) return { label: "AI-Looking", color: "#F97316", desc: "Predicted design elements detected." };
    if (score <= 80) return { label: "Heavy Slop", color: "#EF4444", desc: "Severe derivative/AI-generated template traits." };
    return { label: "Template Collapse", color: "#7F1D1D", desc: "Critical failure of product-specific identity." };
  };

  const rating = getScoreRating(scanResult.overallScore);

  const filteredIssues = scanResult.issues.filter((issue) => {
    if (activeTab === "all") return true;
    if (activeTab === "visual") return issue.category.toLowerCase().includes("visual");
    if (activeTab === "typography") return issue.category.toLowerCase().includes("typography");
    if (activeTab === "layout") return issue.category.toLowerCase().includes("layout");
    if (activeTab === "copy") return issue.category.toLowerCase().includes("copywriting");
    if (activeTab === "ux") return issue.category.toLowerCase().includes("ux") || issue.category.toLowerCase().includes("accessibility");
    if (activeTab === "design") return issue.category.toLowerCase().includes("design");
    if (activeTab === "brand") return issue.category.toLowerCase().includes("brand");
    if (activeTab === "motion") return issue.category.toLowerCase().includes("motion");
    return true;
  });

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto select-none">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#16161a] border-2 border-[#D7E2EA]/15 text-[#D7E2EA] font-mono text-[11px] tracking-wider uppercase shadow-2xl hover:border-[#B600A8] transition-all hover:scale-105 cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#B600A8]/20 to-[#7621B0]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: rating.color }}
          />
          <span>Slop Diagnostics</span>
          <span className="bg-[#D7E2EA]/10 px-1.5 py-0.5 rounded font-bold text-[#B600A8]">
            {scanResult.overallScore}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-end p-4 sm:p-6 bg-[#000000]/70 backdrop-blur-md">
            {/* Modal Backdrop closer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 cursor-default"
            />

            {/* Diagnostics Panel Container */}
            <motion.div
              initial={{ opacity: 0, x: 200, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 200, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[85vw] md:max-w-[1050px] h-[90vh] bg-[#0c0c0e] border-2 border-[#D7E2EA]/10 rounded-[2rem] flex flex-col overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-10 font-sans text-[#D7E2EA]"
            >
              {/* Decorative glows */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#B600A8]/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#7621B0]/5 rounded-full blur-[90px] pointer-events-none" />

              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#D7E2EA]/5 bg-[#121215]/80 backdrop-blur z-20">
                <div className="flex items-center gap-3">
                  <Shield className="h-5.5 w-5.5 text-[#B600A8]" />
                  <div>
                    <h2 className="text-sm font-black tracking-widest uppercase font-mono text-[#D7E2EA]">
                      Slop Reduction Diagnostics
                    </h2>
                    <p className="text-[10px] uppercase font-mono tracking-wider text-[#D7E2EA]/40">
                      Static Analysis Code Scanner v1.0.0
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={triggerScan}
                    disabled={scanning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D7E2EA]/10 hover:border-[#D7E2EA]/20 bg-[#17171c] text-[10px] font-mono tracking-wider uppercase text-[#D7E2EA] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <RefreshCw className={`h-3 w-3 ${scanning ? "animate-spin" : ""}`} />
                    {scanning ? "Scanning..." : "Re-Scan"}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border border-[#D7E2EA]/10 hover:border-[#D7E2EA]/30 bg-[#17171c] p-1.5 text-[#D7E2EA]/60 hover:text-[#D7E2EA] transition-colors cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Panel Body Content (Scrollable Grid) */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Side: Score & Category Metrics */}
                <div className="w-full md:w-[320px] border-r border-[#D7E2EA]/5 bg-[#0f0f12] p-5 flex flex-col overflow-y-auto gap-6 shrink-0">
                  {/* Global Score Meter */}
                  <div className="bg-[#141419] border border-[#D7E2EA]/5 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#D7E2EA]/40 mb-2">
                      Overall Slop Rating
                    </span>
                    <div className="relative flex items-center justify-center w-28 h-28 my-2">
                      {/* Circular Gauge Border */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          className="stroke-[#1d1d26] fill-none"
                          strokeWidth="6"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          className="fill-none transition-all duration-1000 ease-out"
                          strokeWidth="7"
                          strokeDasharray={301.6}
                          strokeDashoffset={301.6 - (301.6 * scanResult.overallScore) / 100}
                          stroke={rating.color}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-black tracking-tighter text-[#D7E2EA] font-mono leading-none">
                          {scanResult.overallScore}
                        </span>
                        <span className="text-[10px] text-[#D7E2EA]/40 uppercase tracking-widest mt-0.5">
                          / 100
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black mb-1"
                        style={{ backgroundColor: rating.color }}
                      >
                        {rating.label}
                      </span>
                      <p className="text-[11px] text-[#D7E2EA]/60 font-light px-2 leading-relaxed">
                        {rating.desc}
                      </p>
                    </div>
                  </div>

                  {/* Category Scores */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#D7E2EA]/40 mb-1 px-1">
                      Scoring Categories
                    </span>
                    {Object.entries(scanResult.categories).map(([key, cat]) => {
                      const isSelected = activeTab === key;
                      const catRating = cat.score;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveTab(isSelected ? "all" : key)}
                          className={`flex flex-col text-left px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                            isSelected
                              ? "bg-[#16161f] border-[#B600A8]/45 text-[#D7E2EA]"
                              : "bg-[#121216]/50 border-[#D7E2EA]/5 text-[#D7E2EA]/60 hover:bg-[#131318]"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-[11px] font-bold tracking-wide uppercase font-mono truncate">
                              {cat.name}
                            </span>
                            <span className="text-[10px] font-mono font-semibold" style={{ color: catRating > 80 ? '#22C55E' : catRating > 50 ? '#EAB308' : '#EF4444' }}>
                              {Math.round(catRating)}%
                            </span>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full h-1 bg-[#1d1d24] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${catRating}%`,
                                backgroundColor: catRating > 80 ? '#22C55E' : catRating > 50 ? '#EAB308' : '#EF4444'
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Detected Issues List */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#0c0c0e] p-5">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4 border-b border-[#D7E2EA]/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4.5 w-4.5 text-[#B600A8]" />
                      <h3 className="text-xs font-black tracking-widest uppercase font-mono">
                        {activeTab === "all" ? "All Detected Problems" : scanResult.categories[activeTab]?.name}
                      </h3>
                      <span className="bg-[#D7E2EA]/5 text-[#D7E2EA]/60 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                        {filteredIssues.length}
                      </span>
                    </div>

                    {activeTab !== "all" && (
                      <button
                        onClick={() => setActiveTab("all")}
                        className="text-[9px] uppercase font-mono tracking-wider text-[#B600A8] hover:underline cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>

                  {/* Issues Scroll Container */}
                  <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                    {filteredIssues.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[#D7E2EA]/10 rounded-2xl bg-[#0f0f13]/50 text-center p-6 text-[#D7E2EA]/30">
                        <CheckCircle className="h-10 w-10 text-green-500/40 mb-3" />
                        <span className="text-xs uppercase font-mono tracking-widest">No issues found</span>
                        <p className="text-[10px] max-w-[240px] mt-1 leading-relaxed">
                          This category scores 100%. Excellent product specificity!
                        </p>
                      </div>
                    ) : (
                      filteredIssues.map((issue) => {
                        const isExpanded = expandedIssue === issue.id;
                        return (
                          <div
                            key={issue.id}
                            className={`border rounded-xl transition-all overflow-hidden ${
                              isExpanded
                                ? "border-[#B600A8]/30 bg-[#121217]"
                                : "border-[#D7E2EA]/5 bg-[#0f0f13]/40 hover:bg-[#121216]/50"
                            }`}
                          >
                            {/* Summary Toggle Clickable */}
                            <button
                              onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}
                              className="w-full text-left p-3.5 flex items-start justify-between gap-4 cursor-pointer"
                            >
                              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-start gap-2.5">
                                  <AlertTriangle
                                    className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${
                                      issue.priority === "HIGH"
                                        ? "text-red-500"
                                        : issue.priority === "MEDIUM"
                                        ? "text-yellow-500"
                                        : "text-blue-400"
                                    }`}
                                  />
                                  <div>
                                    <h4 className="text-[11.5px] font-bold uppercase tracking-tight text-[#D7E2EA] leading-snug">
                                      {issue.reason}
                                    </h4>
                                    <span className="text-[9.5px] font-mono text-[#D7E2EA]/40 uppercase mt-0.5 inline-block">
                                      {issue.file}:{issue.lineNumber}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 font-mono shrink-0">
                                  <span
                                    className={`text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                                      issue.priority === "HIGH"
                                        ? "bg-red-950 text-red-400 border border-red-800/20"
                                        : issue.priority === "MEDIUM"
                                        ? "bg-yellow-950 text-yellow-400 border border-yellow-800/20"
                                        : "bg-blue-950 text-blue-400 border border-blue-800/20"
                                    }`}
                                  >
                                    {issue.priority}
                                  </span>
                                  <span className="text-[9px] text-red-400 bg-red-500/5 px-1.5 py-0.5 rounded">
                                    -{issue.severity}
                                  </span>
                                </div>
                              </div>

                              <ChevronDown
                                className={`h-4 w-4 text-[#D7E2EA]/30 transition-transform mt-0.5 shrink-0 ${
                                  isExpanded ? "rotate-180 text-[#B600A8]" : ""
                                }`}
                              />
                            </button>

                            {/* Accordion Detail Panel */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden border-t border-[#D7E2EA]/5"
                                >
                                  <div className="p-4 bg-[#121217] space-y-3.5 text-xs">
                                    {/* Code Snippet Container */}
                                    <div className="space-y-1">
                                      <span className="text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 font-mono flex items-center gap-1">
                                        <Code className="h-3 w-3" /> Code Reference
                                      </span>
                                      <pre className="p-3 bg-[#08080a] border border-[#D7E2EA]/5 rounded-xl font-mono text-[10.5px] leading-relaxed overflow-x-auto text-[#D7E2EA]/85 whitespace-pre">
                                        <code>
                                          {`L${issue.lineNumber}:  `}
                                          {issue.lineContent}
                                        </code>
                                      </pre>
                                    </div>

                                    {/* Fix Recommendation */}
                                    <div className="flex gap-2.5 p-3 rounded-xl bg-[#B600A8]/5 border border-[#B600A8]/10 text-[#D7E2EA]/90 leading-relaxed text-[11px]">
                                      <Info className="h-4 w-4 text-[#B600A8] shrink-0 mt-0.5" />
                                      <div>
                                        <span className="font-bold text-[#B600A8] uppercase tracking-wider text-[9.5px] block mb-0.5 font-mono">
                                          Refactor Recommendation
                                        </span>
                                        {issue.fix}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Diagnostic Footer Info */}
                  <div className="mt-4 pt-3 border-t border-[#D7E2EA]/5 flex flex-wrap justify-between gap-3 text-[9.5px] font-mono uppercase tracking-widest text-[#D7E2EA]/35">
                    <span>Scanned Files: {scanResult.scannedFiles.length}</span>
                    <span>AI Slop Penalty: {scanResult.issues.reduce((sum, item) => sum + item.severity, 0)} pts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
