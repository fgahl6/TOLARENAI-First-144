#!/usr/bin/env node
/**
 * Build a valid XML sitemap for /quotes
 * Outputs to quotes/quotes-sitemap.xml
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ===== Section config =====
const BASE = "https://tolarenai.com";
const WEB_DIR = "quotes";
const OUT_FILE = "quotes/quotes-sitemap.xml"; // <- align with robots.txt
// ==========================

const ABS_DIR = path.join(process.cwd(), WEB_DIR);
const EXTS = /\.(html)$/i;

if (!fs.existsSync(ABS_DIR)) {
  console.error(`Missing folder: ${ABS_DIR}`);
  process.exit(1);
}

const files = fs
  .readdirSync(ABS_DIR, { withFileTypes: true })
  .filter(d => d.isFile())
  .map(d => d.name)
  .filter(n => !n.startsWith("."))
  .filter(n => EXTS.test(n))
  .sort((a,b)=> a.localeCompare(b, undefined, { numeric:true, sensitivity:'base' }));

function lastmodFor(fileAbsPath) {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${fileAbsPath}"`, { encoding: "utf8" }).trim();
    if (iso) return iso.slice(0, 10);
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

function enc(name) {
  return encodeURIComponent(name).replace(/%2F/gi, "/");
}

const hubLoc = `${BASE}/${WEB_DIR}/`;
const hubMod = new Date().toISOString().slice(0,10);
const entries = [];

entries.push([
  "  <url>",
  `    <loc>${hubLoc}</loc>`,
  `    <lastmod>${hubMod}</lastmod>`,
  "    <changefreq>monthly</changefreq>",
  "    <priority>0.80</priority>",
  "  </url>"
].join("\n"));

for (const name of files) {
  const fileAbs = path.join(ABS_DIR, name);
  const lastmod = lastmodFor(fileAbs);
  const loc = `${BASE}/${WEB_DIR}/${enc(name)}`;
  entries.push([
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    "    <changefreq>monthly</changefreq>",
    "    <priority>0.80</priority>",
    "  </url>"
  ].join("\n"));
}

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  entries.join("\n"),
  `</urlset>`,
  ``
].join("\n");

if (require.main === module) {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, xml, "utf8");
  // helpful log
  console.log(`Wrote ${OUT_FILE} with ${files.length + 1} URLs`);
}

module.exports = { xml };
