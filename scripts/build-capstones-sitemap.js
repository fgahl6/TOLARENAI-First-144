// scripts/build-capstones-sitemap.js
const fs = require("fs");
const path = require("path");

const BASE = "https://tolarenai.com";   // public site base
const WEB_DIR = "capstones";            // folder to scan
const ABS_DIR = path.join(process.cwd(), WEB_DIR);

function listFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((n) => !n.startsWith("."))
    .filter((n) => /\.(pdf|html|md)$/i.test(n));
}

const files = listFiles(ABS_DIR);

const urls = files.map((file) => {
  return `
  <url>
    <loc>${BASE}/${WEB_DIR}/${file}</loc>
  </url>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

console.log(xml);
