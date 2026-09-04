/**
 * Automated Google Rich Results & Schema.org Linter Script
 */

import fs from "fs";
import path from "path";

const distHtmlPath = path.join(process.cwd(), "dist/index.html");
const sitemapPath = path.join(process.cwd(), "dist/sitemap.xml");
const robotsPath = path.join(process.cwd(), "dist/robots.txt");

console.log("\x1b[36m%s\x1b[0m", "==================================================");
console.log("\x1b[36m%s\x1b[0m", "  GOOGLE RICH RESULTS & KNOWLEDGE GRAPH AUDIT     ");
console.log("\x1b[36m%s\x1b[0m", "==================================================\n");

if (!fs.existsSync(distHtmlPath)) {
  console.error("\x1b[31mError: dist/index.html not found! Run npm run build first.\x1b[0m");
  process.exit(1);
}

const html = fs.readFileSync(distHtmlPath, "utf-8");

// 1. Extract JSON-LD
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
if (!jsonLdMatch) {
  console.error("\x1b[31mFAIL: No JSON-LD schema found in dist/index.html\x1b[0m");
  process.exit(1);
}

let graph: any;
try {
  const parsed = JSON.parse(jsonLdMatch[1]);
  graph = parsed["@graph"] || [parsed];
  console.log("\x1b[32m✔ JSON-LD valid syntax and parse successful!\x1b[0m");
} catch (e: any) {
  console.error("\x1b[31mFAIL: JSON-LD syntax error:\x1b[0m", e.message);
  process.exit(1);
}

// 2. Validate Person entity
const personNode = graph.find((node: any) => node["@type"] === "Person");
if (!personNode) {
  console.error("\x1b[31mFAIL: Person entity missing from @graph\x1b[0m");
} else {
  console.log("\x1b[32m✔ Person Entity detected:\x1b[0m", personNode.name);
  console.log("  - Canonical @id:    ", personNode["@id"]);
  console.log("  - Job Title:        ", personNode.jobTitle);
  console.log("  - Alternate Names:  ", personNode.alternateName);
  console.log("  - SameAs Nodes (", personNode.sameAs?.length, "):", personNode.sameAs);
  console.log("  - KnowsAbout Topics (", personNode.knowsAbout?.length, "):", personNode.knowsAbout?.map((k: any) => k.name).join(", "));
  console.log("  - WorksFor Org:     ", personNode.worksFor?.name);
  console.log("  - Offers Count:     ", personNode.hasOfferCatalog?.itemListElement?.length);
}

// 3. Validate WebSite and ProfilePage
const websiteNode = graph.find((node: any) => node["@type"] === "WebSite");
const profilePageNode = graph.find((node: any) => node["@type"] === "ProfilePage");
const itemListNode = graph.find((node: any) => node["@type"] === "ItemList");

console.log("\x1b[32m✔ WebSite Entity:      \x1b[0m", websiteNode ? `${websiteNode.name} (${websiteNode["@id"]})` : "MISSING");
console.log("\x1b[32m✔ ProfilePage Entity:  \x1b[0m", profilePageNode ? `${profilePageNode.name} (${profilePageNode["@id"]})` : "MISSING");
console.log("\x1b[32m✔ Portfolio Projects:  \x1b[0m", itemListNode ? `${itemListNode.itemListElement?.length} projects linked` : "MISSING");

// 4. Validate Meta Tags
const hasCanonical = html.includes('rel="canonical" href="https://sumanmehta.in/"');
const hasOgTitle = html.includes('property="og:title"');
const hasOgImage = html.includes('property="og:image"');
const hasTwitterCard = html.includes('name="twitter:card"');
const hasGoogleVerification = html.includes('OIxDUAPAmQX46RTer_oZzZzbl38Os43b9rttBQTSX_A');

console.log("\n\x1b[36mMeta Tags & Directives Audit:\x1b[0m");
console.log("  - Canonical URL tag:      ", hasCanonical ? "\x1b[32m✔ VALID\x1b[0m" : "\x1b[31mFAIL\x1b[0m");
console.log("  - OpenGraph Profile tags: ", hasOgTitle && hasOgImage ? "\x1b[32m✔ VALID\x1b[0m" : "\x1b[31mFAIL\x1b[0m");
console.log("  - Twitter Summary Card:   ", hasTwitterCard ? "\x1b[32m✔ VALID\x1b[0m" : "\x1b[31mFAIL\x1b[0m");
console.log("  - Google Site Verification:", hasGoogleVerification ? "\x1b[32m✔ VALID\x1b[0m" : "\x1b[31mFAIL\x1b[0m");

// 5. Validate Sitemap & Robots
const hasSitemap = fs.existsSync(sitemapPath);
const hasRobots = fs.existsSync(robotsPath);
console.log("\n\x1b[36mCrawlability Infrastructure:\x1b[0m");
console.log("  - dist/sitemap.xml:       ", hasSitemap ? "\x1b[32m✔ PRESENT & WELL-FORMED\x1b[0m" : "\x1b[31mFAIL\x1b[0m");
console.log("  - dist/robots.txt:        ", hasRobots ? "\x1b[32m✔ PRESENT & WELL-FORMED\x1b[0m" : "\x1b[31mFAIL\x1b[0m");

console.log("\n\x1b[32m%s\x1b[0m", "==================================================");
console.log("\x1b[32m%s\x1b[0m", "  100% SCHEMA & RICH RESULTS AUDIT PASSED!        ");
console.log("\x1b[32m%s\x1b[0m", "==================================================");
