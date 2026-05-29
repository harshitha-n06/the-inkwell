document.addEventListener('DOMContentLoaded', async () => {
  const q = qs('q') || '';

  document.getElementById('searchTitle').textContent =
    q ? `Results for "${q}"` : 'Search';

  const input = document.getElementById('searchInput');
  if (input) input.value = q;

  if (!q.trim()) {
    document.getElementById('resultList').innerHTML =
      '<div class="empty-state"><h3>Enter a search term</h3><p>Type something in the search bar above.</p></div>';
    document.getElementById('searchCount').textContent = '';
    return;
  }

  try {
    const results = await api.posts.search(q);
    const count   = document.getElementById('searchCount');
    count.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} found`;

    if (!results.length) {
      document.getElementById('resultList').innerHTML =
        `<div class="empty-state"><h3>No results</h3><p>No posts matched "<em>${escHtml(q)}</em>".</p></div>`;
      return;
    }

    document.getElementById('resultList').innerHTML = results.map(p => renderResult(p, q)).join('');
  } catch (err) {
    document.getElementById('resultList').innerHTML =
      `<div class="alert alert-error">${escHtml(err.message)}</div>`;
  }
});

function renderResult(post, q) {
  const rawExcerpt = excerpt(post.content, 200);
  return `
    <div class="post-card">
      <h3><a href="/post.html?id=${post.id}">${highlight(post.title, q)}</a></h3>
      <p class="post-excerpt">${highlight(rawExcerpt, q)}</p>
      <div class="post-meta">
        <span>By <a href="/profile.html?id=${post.author_id}">${escHtml(post.author_name)}</a></span>
        <span>${formatDate(post.created_at)}</span>
        <span>${post.comment_count} comment${post.comment_count == 1 ? '' : 's'}</span>
      </div>
    </div>`;
}
