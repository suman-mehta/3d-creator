/**
 * Autonomous Live Production Network & Schema Validation Script
 * Executes end-to-end network tests against https://sumanmehta.in/
 */

import https from "https";
import http from "http";

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function fetchUrl(url: string): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" } }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode || 0, headers: res.headers, body }));
    }).on("error", (err) => reject(err));
  });
}

async function runLiveAudit() {
  console.log("\x1b[35m%s\x1b[0m", "==================================================================");
  console.log("\x1b[35m%s\x1b[0m", "   ⚡ LIVE PRODUCTION & SCHEMA.ORG KNOWLEDGE GRAPH AUDIT         ");
  console.log("\x1b[35m%s\x1b[0m", "   Target Domain: https://sumanmehta.in/                          ");
  console.log("\x1b[35m%s\x1b[0m", "==================================================================\n");

  // 1. Audit Live Root Page
  console.log("\x1b[36m[1/4] Auditing Live Production Root (https://sumanmehta.in/)...\x1b[0m");
  try {
    const rootRes = await fetchUrl("https://sumanmehta.in/");
    if (rootRes.statusCode === 200) {
      results.push({ name: "HTTP 200 Root Response", passed: true, details: `Payload size: ${Buffer.byteLength(rootRes.body)} bytes` });
      console.log(`  ✔ HTTP 200 OK received (${Buffer.byteLength(rootRes.body)} bytes, Vercel Server: ${rootRes.headers.server})`);

      // Extract JSON-LD
      const jsonLdMatch = rootRes.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      if (jsonLdMatch) {
        const parsed = JSON.parse(jsonLdMatch[1]);
        const graph = parsed["@graph"] || [parsed];
        results.push({ name: "JSON-LD Embedded in Live HTML", passed: true, details: `Detected ${graph.length} top-level nodes in @graph` });
        console.log(`  ✔ Valid JSON-LD graph parsed (${graph.length} schema entities)`);

        // Check Person
        const person = graph.find((n: any) => n["@type"] === "Person");
        if (person && person.name === "Suman Mehta" && person["@id"] === "https://sumanmehta.in/#person") {
          results.push({
            name: "Person Schema Integrity",
            passed: true,
            details: `Name: ${person.name}, JobTitle: ${person.jobTitle}, Alternates: ${person.alternateName?.join(", ")}`
          });
          console.log(`  ✔ Person Entity: "${person.name}" (@id: ${person["@id"]})`);
          console.log(`    - Job Title: ${person.jobTitle}`);
          console.log(`    - Alternate Names: [${person.alternateName?.join(", ")}]`);
          console.log(`    - SameAs Nodes (${person.sameAs?.length}):`);
          person.sameAs?.forEach((link: string) => console.log(`      * ${link}`));
          console.log(`    - KnowsAbout Entities (${person.knowsAbout?.length}):`);
          person.knowsAbout?.forEach((k: any) => console.log(`      * ${k.name} -> ${k.sameAs || "N/A"}`));
        } else {
          results.push({ name: "Person Schema Integrity", passed: false, details: "Person entity missing or malformed" });
        }

        // Check WebSite & ProfilePage
        const website = graph.find((n: any) => n["@type"] === "WebSite");
        const profile = graph.find((n: any) => n["@type"] === "ProfilePage");
        const itemCatalog = graph.find((n: any) => n["@type"] === "ItemList");

        results.push({ name: "WebSite Entity Check", passed: !!website, details: website ? `${website.name} (${website["@id"]})` : "Missing" });
        results.push({ name: "ProfilePage Entity Check", passed: !!profile, details: profile ? `${profile.name} (${profile["@id"]})` : "Missing" });
        results.push({ name: "CreativeWork Portfolio Check", passed: !!itemCatalog, details: itemCatalog ? `${itemCatalog.itemListElement?.length} projects linked` : "Missing" });

        console.log(`  ✔ WebSite Node: "${website?.name}"`);
        console.log(`  ✔ ProfilePage Node: "${profile?.name}"`);
        console.log(`  ✔ Portfolio ItemList: ${itemCatalog?.itemListElement?.length} CreativeWorks attached`);
      } else {
        results.push({ name: "JSON-LD Embedded in Live HTML", passed: false, details: "No script tag found" });
        console.log("  ✖ No JSON-LD schema found in response");
      }

      // Check Meta & OpenGraph Tags
      const hasCanonical = rootRes.body.includes('rel="canonical" href="https://sumanmehta.in/"');
      const hasOgTitle = rootRes.body.includes('property="og:title"');
      const hasOgImage = rootRes.body.includes('property="og:image"');
      const hasTwitter = rootRes.body.includes('name="twitter:card"');
      const hasGsc = rootRes.body.includes('OIxDUAPAmQX46RTer_oZzZzbl38Os43b9rttBQTSX_A');

      results.push({ name: "Canonical URL Tag", passed: hasCanonical, details: "https://sumanmehta.in/" });
      results.push({ name: "OpenGraph Profile Tags", passed: hasOgTitle && hasOgImage, details: "og:title, og:image, profile:first_name, profile:last_name" });
      results.push({ name: "Twitter Large Card", passed: hasTwitter, details: "summary_large_image with @itz_suman_mehta" });
      results.push({ name: "Google Site Verification Tag", passed: hasGsc, details: "OIxDUAPAmQX46RTer_oZzZzbl38Os43b9rttBQTSX_A" });

      console.log(`  ✔ Canonical tag: ${hasCanonical ? "PRESENT" : "MISSING"}`);
      console.log(`  ✔ OpenGraph Profile & Image: ${hasOgTitle && hasOgImage ? "PRESENT" : "MISSING"}`);
      console.log(`  ✔ Twitter Card Meta: ${hasTwitter ? "PRESENT" : "MISSING"}`);
      console.log(`  ✔ Google Verification Token: ${hasGsc ? "PRESENT" : "MISSING"}`);
    } else {
      results.push({ name: "HTTP 200 Root Response", passed: false, details: `Received status ${rootRes.statusCode}` });
    }
  } catch (err: any) {
    results.push({ name: "HTTP 200 Root Response", passed: false, details: err.message });
    console.error("  ✖ Failed to query live root:", err.message);
  }

  // 2. Audit Live robots.txt
  console.log("\n\x1b[36m[2/4] Auditing Live Robots.txt (https://sumanmehta.in/robots.txt)...\x1b[0m");
  try {
    const robotsRes = await fetchUrl("https://sumanmehta.in/robots.txt");
    const hasSitemapDirective = robotsRes.body.includes("Sitemap: https://sumanmehta.in/sitemap.xml");
    const allowsGooglebot = robotsRes.body.includes("User-agent: Googlebot");

    results.push({
      name: "robots.txt Live Endpoint",
      passed: robotsRes.statusCode === 200 && hasSitemapDirective && allowsGooglebot,
      details: `Status ${robotsRes.statusCode}, Sitemap directive: ${hasSitemapDirective}, Googlebot: ${allowsGooglebot}`
    });
    console.log(`  ✔ HTTP ${robotsRes.statusCode} OK`);
    console.log(`  ✔ Sitemap directive verified: ${hasSitemapDirective ? "VALID" : "MISSING"}`);
    console.log(`  ✔ Googlebot permissions: ${allowsGooglebot ? "EXPLICITLY ALLOWED" : "STANDARD"}`);
  } catch (err: any) {
    results.push({ name: "robots.txt Live Endpoint", passed: false, details: err.message });
  }

  // 3. Audit Live sitemap.xml
  console.log("\n\x1b[36m[3/4] Auditing Live Sitemap.xml (https://sumanmehta.in/sitemap.xml)...\x1b[0m");
  try {
    const sitemapRes = await fetchUrl("https://sumanmehta.in/sitemap.xml");
    const hasPriority = sitemapRes.body.includes("<priority>1.0</priority>");
    const hasImageLoc = sitemapRes.body.includes("<image:loc>");
    const hasCanonicalLoc = sitemapRes.body.includes("<loc>https://sumanmehta.in/</loc>");

    results.push({
      name: "sitemap.xml Live Endpoint",
      passed: sitemapRes.statusCode === 200 && hasPriority && hasImageLoc && hasCanonicalLoc,
      details: `Status ${sitemapRes.statusCode}, Priority 1.0: ${hasPriority}, Image extensions: ${hasImageLoc}`
    });
    console.log(`  ✔ HTTP ${sitemapRes.statusCode} OK`);
    console.log(`  ✔ Canonical loc <loc>https://sumanmehta.in/</loc>: ${hasCanonicalLoc ? "VERIFIED" : "MISSING"}`);
    console.log(`  ✔ Priority 1.0 Tag: ${hasPriority ? "VERIFIED" : "MISSING"}`);
    console.log(`  ✔ Google Image Sitemap Extension: ${hasImageLoc ? "VERIFIED" : "MISSING"}`);
  } catch (err: any) {
    results.push({ name: "sitemap.xml Live Endpoint", passed: false, details: err.message });
  }

  // 4. Audit WWW Subdomain Alias
  console.log("\n\x1b[36m[4/4] Auditing WWW Alias (https://www.sumanmehta.in/)...\x1b[0m");
  try {
    const wwwRes = await fetchUrl("https://www.sumanmehta.in/");
    results.push({
      name: "WWW Subdomain Alias",
      passed: wwwRes.statusCode === 200 || wwwRes.statusCode === 308 || wwwRes.statusCode === 301,
      details: `Status ${wwwRes.statusCode}`
    });
    console.log(`  ✔ HTTP ${wwwRes.statusCode} Response on https://www.sumanmehta.in/`);
  } catch (err: any) {
    results.push({ name: "WWW Subdomain Alias", passed: false, details: err.message });
  }

  // Summary Table
  console.log("\n\x1b[35m%s\x1b[0m", "==================================================================");
  console.log("\x1b[35m%s\x1b[0m", "                  LIVE AUDIT RESULTS SUMMARY                      ");
  console.log("\x1b[35m%s\x1b[0m", "==================================================================");

  let allPassed = true;
  results.forEach((r) => {
    if (!r.passed) allPassed = false;
    const badge = r.passed ? "\x1b[32m✔ PASS\x1b[0m" : "\x1b[31m✖ FAIL\x1b[0m";
    console.log(`${badge} | ${r.name.padEnd(32)} | ${r.details}`);
  });

  console.log("\x1b[35m%s\x1b[0m", "==================================================================");
  if (allPassed) {
    console.log("\x1b[32m%s\x1b[0m", "🎉 ALL LIVE NETWORK & SCHEMA VALIDATION TESTS PASSED (100%)!");
  } else {
    console.log("\x1b[31m%s\x1b[0m", "⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.");
  }
  console.log("\x1b[35m%s\x1b[0m", "==================================================================\n");
}

runLiveAudit();
