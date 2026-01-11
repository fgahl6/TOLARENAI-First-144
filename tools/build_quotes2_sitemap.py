#!/usr/bin/env python3
import os
import sys
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

REPO_ROOT = Path(__file__).resolve().parents[1]
QUOTES2_DIR = REPO_ROOT / "quotes2"
OUTPUT_FILE = QUOTES2_DIR / "quotes2-sitemap.xml"
BASE_URL = "https://tolarenai.com/quotes2/"

VALID_EXTS = {".html", ".htm", ".xhtml"}


def run_git_lastmod(rel_path: str) -> str | None:
    """
    Return YYYY-MM-DD from git last commit affecting rel_path, or None.
    """
    try:
        # ISO strict date from git, ex: 2026-01-11
        out = subprocess.check_output(
            ["git", "log", "-1", "--format=%cs", "--", rel_path],
            cwd=REPO_ROOT,
            stderr=subprocess.DEVNULL,
            text=True,
        ).strip()
        return out or None
    except Exception:
        return None


def today_utc() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def main() -> int:
    if not QUOTES2_DIR.exists():
        print(f"ERROR: quotes2 directory not found at {QUOTES2_DIR}", file=sys.stderr)
        return 1

    files: list[Path] = []
    for p in QUOTES2_DIR.rglob("*"):
        if not p.is_file():
            continue
        if p.name == OUTPUT_FILE.name:
            continue
        if p.suffix.lower() not in VALID_EXTS:
            continue
        files.append(p)

    # Sort by filename for stable output
    files.sort(key=lambda x: x.name.lower())

    default_lastmod = today_utc()

    lines: list[str] = []
    lines.append('<?xml version="1.0" encoding="UTF-8"?>')
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    for f in files:
        rel = f.relative_to(REPO_ROOT).as_posix()  # e.g., quotes2/1001_foo.html
        # URL should be /quotes2/<filename> (flat), even if file is nested.
        # If you do not use subfolders, this is identical.
        loc = BASE_URL + escape(f.name)

        lastmod = run_git_lastmod(rel) or default_lastmod

        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("    <changefreq>yearly</changefreq>")
        lines.append("    <priority>0.60</priority>")
        lines.append("  </url>")

    lines.append("</urlset>")
    xml = "\n".join(lines) + "\n"

    OUTPUT_FILE.write_text(xml, encoding="utf-8")
    print(f"Wrote {OUTPUT_FILE} with {len(files)} URLs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
