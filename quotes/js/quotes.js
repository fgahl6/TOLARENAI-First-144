// quotes/js/quotes.js
(() => {
  "use strict";

  // Resolve /quotes/manifest.json relative to this script, robust to path changes
  const manifestURL = new URL("../manifest.json", document.currentScript.src).href;

  // The category/tag for this page (set in <body data-tag="...">)
  const activeTag = document.body.getAttribute("data-tag") || "";

  // Where we render
  const mount = document.getElementById("quotes-list");
  if (!mount) return; // Nothing to do

  // Tiny helper: escape HTML
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

  // Render the list
  function render(quotes) {
    if (!quotes.length) {
      mount.innerHTML = `<p>No quotes yet for <strong>${esc(activeTag)}</strong>.</p>`;
      return;
    }

    // Build an ordered list with explicit spreadsheet numbers (#order)
    const html = [
      `<ol class="quote-list">`,
      ...quotes.map(q => {
        const tags = (q.tags || []).join(", ");
        // If you later create per-quote pages, point href at them; for now keep '#'
        const href = `#`;
        return `
          <li class="quote-item">
            <div class="quote-meta"><span class="ord">#${esc(q.order)}</span> <span class="tags">${esc(tags)}</span></div>
            <h3 class="quote-title"><a href="${href}">${esc(q.title)}</a></h3>
            <p class="quote-excerpt">${esc(q.excerpt)}</p>
          </li>`;
      }),
      `</ol>`
    ].join("");
    mount.innerHTML = html;
  }

  // Fetch, filter, sort, render
  fetch(manifestURL, { cache: "no-cache" })
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load manifest.json (${r.status})`);
      return r.json();
    })
    .then(data => {
      let list = Array.isArray(data.quotes) ? data.quotes.slice() : [];

      // Filter by tag when we're on a category page
      if (activeTag) {
        list = list.filter(q => Array.isArray(q.tags) && q.tags.includes(activeTag));
      }

      // Sort by spreadsheet order (missing orders go to the bottom)
      list.sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999));

      render(list);
    })
    .catch(err => {
      console.error(err);
      mount.innerHTML = `<p>Could not load quotes. Please try again later.</p>`;
    });

})();
