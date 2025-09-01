<script>
async function renderTag(tag, containerId) {
  try {
    const res = await fetch('/quotes/manifest.json', {cache: 'no-store'});
    const data = await res.json();
    const list = (data.quotes || []).filter(q => q.tags && q.tags[0] === tag);

    const el = document.getElementById(containerId);
    if (!el) return;

    if (!list.length) {
      el.innerHTML = `<p class="note">No quotes yet for <strong>${tag}</strong>. Check back soon.</p>`;
      return;
    }

    el.innerHTML = list.map(q => `
      <article class="card">
        <h3><a href="/quotes/${q.slug}.html">${q.title}</a></h3>
        <p>${q.excerpt}</p>
        <p class="tags">${q.tags.map(t => `<a href="/quotes/tag/${t}.html">${t}</a>`).join(' · ')}</p>
      </article>
    `).join('');
  } catch (e) {
    console.error(e);
    document.getElementById(containerId).innerHTML =
      '<p class="note">Could not load quotes right now.</p>';
  }
}
</script>
<style>
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
  .card{border:1px solid #e5edf5;border-radius:14px;padding:14px;background:#fbfdff;box-shadow:0 4px 16px rgba(7,36,58,.06)}
  .card h3{margin:.2rem 0 .4rem 0;font-size:1.05rem}
  .card a{text-decoration:none;color:#174d7a}
  .tags{font-size:.9rem;color:#395b79}
  .note{color:#395b79}
</style>
