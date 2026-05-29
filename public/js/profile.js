document.addEventListener('DOMContentLoaded', async () => {
  const id = qs('id');
  if (!id) {
    document.getElementById('profileContent').innerHTML =
      '<div class="alert alert-error">No user ID provided.</div>';
    return;
  }

  try {
    const user = await api.users.profile(id);
    document.title = `${user.username} — The Inkwell`;
    renderProfile(user);
  } catch (err) {
    document.getElementById('profileContent').innerHTML =
      `<div class="alert alert-error">${escHtml(err.message)}</div>`;
  }
});

function renderProfile(user) {
  const initial = user.username.charAt(0).toUpperCase();
  const postsHtml = user.posts.length
    ? user.posts.map(p => `
        <div class="post-card">
          <h3><a href="/post.html?id=${p.id}">${escHtml(p.title)}</a></h3>
          <p class="post-excerpt">${escHtml(excerpt(p.content))}</p>
          <div class="post-meta">
            <span>${formatDate(p.created_at)}</span>
            <span>${p.comment_count} comment${p.comment_count == 1 ? '' : 's'}</span>
          </div>
        </div>`).join('')
    : '<div class="empty-state"><h3>No posts yet</h3><p>This author hasn\'t written anything.</p></div>';

  document.getElementById('profileContent').innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">${initial}</div>
      <div>
        <div class="profile-name">${escHtml(user.username)}</div>
        <div class="profile-meta">Member since ${formatDate(user.created_at)} &nbsp;·&nbsp; ${user.posts.length} post${user.posts.length !== 1 ? 's' : ''}</div>
      </div>
    </div>

    <div class="section-heading">
      <h2>Posts by ${escHtml(user.username)}</h2>
    </div>
    <div class="post-list">${postsHtml}</div>
  `;
}
