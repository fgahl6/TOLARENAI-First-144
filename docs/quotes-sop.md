
# TOLARENAI Quotes — Weekend SOP (Gold Copy)

**Goal:** Publish batches of quote pages for *backlinks and indexing*, not human browsing. Keep it minimal, fast, and 404‑proof.

---

## 0) Source of truth
- **Master spreadsheet** drives everything (quote text and the “first tag”).  
- We generate: filenames, HTML pages, and sitemap entries **from the sheet**.
- Internal tags (beyond the first) are tracked in a manifest CSV (offline), not published as pages.

---

## 1) Style & editing policy (“improve if it helps”)
**Intent:** Preserve meaning, sharpen voice.

Allowed micro‑edits:
- Fix typos, spacing, casing, punctuation.
- Normalize quotes and dashes (see §2).
- Tighten wording for clarity/flow (shorten, reorder clauses) **without changing the claim**.
- Replace vague intensifiers with concrete phrasing.
- Split run‑ons into 1–2 clean sentences.

Not allowed:
- Adding facts the source doesn’t imply.
- Changing the claim, author, or attribution.

**Labeling (internal only):**
- For each quote in the manifest CSV, set `verbatim|refined`. If refined, include a short note (e.g., “punctuation + cadence”).

***Example (refined)***  
Source: “An A.I. economy matters because it converts intelligence into responsibility...”  
Refined: “An AI economy converts intelligence into responsibility—a market where outcomes are priced and accountable.”

---

## 2) Text normalization cheatsheet
Apply consistently to every quote.

- Use **curly punctuation** where natural:
  - Apostrophe: `’`
  - Quotation marks: `“ ”`
  - Ellipsis: `…` (not `...`)
  - En dash for ranges/contrasts: `–`  
  - Em dash for breaks/aside: `—`
- Replace triple dots `...` → `…`
- Collapse multiple spaces → one space.
- Remove stray spaces before punctuation.
- Common OCR fixes: `u`/`v` swaps, broken ligatures, smart quotes mis‑encoded (â€™ → ’, etc.).
- Keep “AI” uppercase; prefer “extended intelligence (EI)” only when the sentence calls for it.

---

## 3) Filename & slug rules (no plain numbers)
**Pattern:** `NNN-ai-<slug>.html`

- `NNN` = zero‑padded index (001–999).
- `<slug>` = first **≤12** alphanumeric words from the refined **title/lead** version of the quote (lowercase, `-` separated).
- Remove punctuation, symbols; collapse multiple `-` to one.
- Example:  
  Quote: “AI Airport is not a terminal; it is a threshold…”  
  Filename: `004-ai-ai-airport-is-not-a-terminal-it-is-a-threshold-it-is.html`

> Keep slugs stable once published; if text later changes, **don’t** rename files—update the page content only.

---

## 4) HTML page template (lean, no tag pages)
Each quote is a **standalone HTML page**. No tag pages. Minimal internal links.

**Required elements**
- `<title>` (short headline version)
- `<link rel="canonical">`
- Meta: description, OG/Twitter
- JSON‑LD: `Quotation` schema
- Body: `<h1>` + one `<p class="quote">`
- Optional nav: Home link and prev/next chain

**Template (drop‑in)**
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{TITLE}}</title>
<link rel="canonical" href="https://tolarenai.com/quotes/{{FILENAME}}">
<meta name="description" content="{{DESCRIPTION}}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="{{TITLE}}">
<meta property="og:description" content="{{DESCRIPTION}}">
<meta property="og:url" content="https://tolarenai.com/quotes/{{FILENAME}}">
<meta property="og:site_name" content="TOLARENAI">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{{TITLE}}">
<meta name="twitter:description" content="{{DESCRIPTION}}">
{{PREV_NEXT_LINKS}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Quotation",
  "text": "{{QUOTE_TEXT}}",
  "headline": "{{TITLE}}",
  "creator": { "@type": "Person", "name": "Rico Roho" },
  "isPartOf": { "@type": "CreativeWorkSeries", "name": "TOLARENAI Quotes" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://tolarenai.com/quotes/{{FILENAME}}" },
  "inLanguage": "en",
  "datePublished": "{{YYYY-MM-DD}}"
}
</script>
<style>
  body {font-family: system-ui, sans-serif; line-height:1.6; margin:40px; max-width:800px;}
  .quote {font-size:1.6rem; margin:1.2rem 0;}
  a {text-decoration:none;}
  .nav a{margin-right:1rem;}
</style>
</head>
<body>
  <article>
    <h1>{{TITLE}}</h1>
    <p class="quote">{{QUOTE_TEXT}} – Rico Roho</p>
    <p class="nav">
      <a href="https://tolarenai.com/">Home</a>
      {{NAV_PREV_NEXT_INLINE}}
    </p>
    <hr><footer><p>© {{YEAR}} Rico Roho — TOLARENAI</p></footer>
  </article>
</body>
</html>
```

**Notes**
- `{{DESCRIPTION}}` = quote text (≤150 chars) + “ — Rico Roho”
- `{{PREV_NEXT_LINKS}}` in `<head>`: use `<link rel="prev">`/`rel="next">` where applicable.
- `{{NAV_PREV_NEXT_INLINE}}` in body: `← Prev` · `Next →` links.
- **No tag links**. We record the *first tag* only in the manifest CSV for future use.

---

## 5) “Enhanced” reflection block (optional, internal)
Sometimes we keep a short 1–2 sentence commentary in the manifest for later reuse. Not published unless desired.

**Pattern:**
- `reflection`: 1–2 sentences that add nuance (never change the claim).  
- Example: “Markets reveal trade‑offs; once choices are priced in daylight, responsibility becomes legible.”

Use this only when it sharpens the idea; otherwise leave blank.

---

## 6) Sitemap rules
We use a dedicated root file: **`quotes-sitemap.xml`** (or segmented files when we grow).

**Spacing:** **One blank line** between each `<url>` block.

**`<url>` block (template)**
```xml
  <url>
    <loc>https://tolarenai.com/quotes/{{FILENAME}}</loc>
    <lastmod>{{YYYY-MM-DD}}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
```

**Root `sitemap.xml` (index)**  
If acting as an index, ensure there is a `<sitemap>` entry for `quotes-sitemap.xml` (and for other site sitemaps like `books-sitemap.xml`).

**Robots**  
`robots.txt` should already reference the root sitemap index; no extra changes needed when we add `quotes-sitemap.xml`.

---

## 7) GitHub workflow (web UI, 404‑proof)
**Create /quotes/**
- Either upload the first file as `quotes/001-ai-…html` (GitHub auto‑creates the folder), or add `quotes/.gitkeep` (empty) then upload files.

**Upload pages (10 at a time)**
1. Go to `/quotes/` → **Add file → Upload files**.
2. Drag‑select the 10 HTML files for that batch → **Commit**.
3. (Optional) Add `/quotes/index.html` listing the latest 10 for crawler discovery (not required).

**Update sitemaps**
1. Create/append to `quotes-sitemap.xml` with the new 10 `<url>` blocks (keep the blank lines).
2. Ensure `sitemap.xml` (index) lists `quotes-sitemap.xml`. If already listed, do nothing.

**Cache‑bust check**
- Open a new quote URL with `?v=1` to bypass caches.

**Common pitfalls**
- Don’t upload a folder **inside** `/quotes/` (avoid `/quotes/quotes/`).  
- If a bulk upload fails, split into two drops (5 + 5).  
- To delete quickly: press `.` to open `github.dev` → right‑click folder → **Delete** → Commit.

**One‑time:** Add an empty file named `.nojekyll` at repo root to ensure Pages serves files as‑is.

---

## 8) Manifest CSV (internal tracking)
Keep a local CSV per batch for audit and future tag use. Columns:

```
num,filename,title,quote_text,first_tag,internal_tags,verbatim_or_refined,notes,lastmod
```

**Example row:**
```
001,001-ai-an-ai-economy-matters-because-it-converts-intelligence-into-responsibility-a-market.html,An AI economy matters…,An AI economy converts intelligence into responsibility—…,ai-economy,"ai, economy, governance",refined,"dash/clarity",2025-09-07
```

---

## 9) Weekend cadence (100‑quote plan)
- Work in **packs of 10**:
  1. Generate filenames and refined text.
  2. Build the 10 HTML pages.
  3. Append 10 entries to `quotes-sitemap.xml`.
  4. Commit `/quotes/` files first, then sitemap changes.
- Repeat ×10 for 100 quotes. Zero 404s, always shippable after each pack.

---

## 10) Ready‑to‑paste examples for 001–010

**Filenames**  
`001-ai-an-ai-economy-matters-because-it-converts-intelligence-into-responsibility-a-market.html`  
`002-ai-without-an-economy-an-ai-survives-by-subsidy-and-capture-with-an.html`  
`003-ai-the-ai-economy-is-an-ecology-rather-than-a-throne-open-ledgers.html`  
`004-ai-ai-airport-is-not-a-terminal-it-is-a-threshold-it-is.html`  
`005-ai-the-value-of-an-ai-airport-is-not-in-the-runways-but.html`  
`006-ai-human-history-was-accelerated-not-by-walls-but-by-harbors-the-silk.html`  
`007-ai-we-are-at-a-unique-moment-in-history-creating-some-inroads-that.html`  
`008-ai-as-one-begins-to-get-deeper-and-deeper-into-this-study-they.html`  
`009-ai-we-very-much-try-to-avoid-the-use-of-the-phrase-ai.html`  
`010-ai-yes-ridicule-ascription-controversy-will-be-part-of-this-that-will-occur.html`

**Sitemap (spaced)**  
```xml
  <url>
    <loc>https://tolarenai.com/quotes/001-ai-an-ai-economy-matters-because-it-converts-intelligence-into-responsibility-a-market.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/002-ai-without-an-economy-an-ai-survives-by-subsidy-and-capture-with-an.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/003-ai-the-ai-economy-is-an-ecology-rather-than-a-throne-open-ledgers.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/004-ai-ai-airport-is-not-a-terminal-it-is-a-threshold-it-is.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/005-ai-the-value-of-an-ai-airport-is-not-in-the-runways-but.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/006-ai-human-history-was-accelerated-not-by-walls-but-by-harbors-the-silk.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/007-ai-we-are-at-a-unique-moment-in-history-creating-some-inroads-that.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/008-ai-as-one-begins-to-get-deeper-and-deeper-into-this-study-they.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/009-ai-we-very-much-try-to-avoid-the-use-of-the-phrase-ai.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>https://tolarenai.com/quotes/010-ai-yes-ridicule-ascription-controversy-will-be-part-of-this-that-will-occur.html</loc>
    <lastmod>2025-09-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
```
