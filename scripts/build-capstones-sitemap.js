// scripts/build-capstones-sitemap.js
// Generates capstones-sitemap.xml from files in /capstones

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SITE = "https://tolarenai.com";        // public site root
const DIR  = "capstones";                    // source folder
const OUT  = "capstones-sitemap.xml";        // output at repo root

// Which files to include in the sitemap:
const EXT_PATTERN = /\.(pdf|mp4|md|html)$/i;

function gitLastModISO(filePath) {
  try {
    // ISO 8601 of the last commit that touched this file
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    // Sitemap wants YYYY-MM-DD (date-only is fine)
    return iso.slice(0, 10);
  } catch {
    // Fallback: today
    return new Date().toISOString().slice(0, 10);
  }
}

function listFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => {
      const p = path.join(dir, name);
      return fs.statSync(p).isFile() && EXT_PATTERN.test(name);
    })
    // Natural-ish sort so "1,2,10" looks sane
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

function buildXml(urls) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  lines.push("");

  for (const { loc, lastmod } of urls) {
    lines.push("  <url>");
    lines.push(`    <loc>${loc}</loc>`);
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push("    <changefreq>yearly</changefreq>");
    lines.push("    <priority>0.6</priority>");
    lines.push("  </url>");
  }

  lines.push("");
  lines.push("</urlset>");
  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(DIR)) {
    console.error(`Folder "${DIR}" not found. Exiting.`);
    process.exit(1);
  }

  const files = listFiles(DIR);
  const urls = files.map((file) => {
    const webPath = `/${DIR}/${encodeURIComponent(file)}`; // encode spaces etc.
    return {
      loc: `${SITE}${webPath}`,
      lastmod: gitLastModISO(path.join(DIR, file)),
    };
  });

  const xml = buildXml(urls);
  fs.writeFileSync(OUT, xml);
  console.log(`Generated ${OUT} with ${urls.length} item(s).`);
}

main();
