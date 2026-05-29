document.addEventListener('DOMContentLoaded', async () => {
  loadStats();
  loadPosts();
});

async function loadStats() {
  try {
    const data = await api.posts.stats();
    document.getElementById('stats').innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${data.totalPosts}</div>
        <div class="stat-label">Posts published</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${data.totalComments}</div>
        <div class="stat-label">Comments shared</div>
      </div>
    `;
  } catch {
    document.getElementById('stats').innerHTML = '';
  }
}

async function loadPosts() {
  const container = document.getElementById('postList');
  try {
    const posts = await api.posts.list();
    if (!posts.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No posts yet</h3>
          <p>Be the first to write something.</p>
          ${isLoggedIn() ? '<a href="/create-post.html" class="btn btn-primary" style="margin-top:1rem">Write a post</a>' : ''}
        </div>`;
      return;
    }
    container.innerHTML = posts.map(renderPostCard).join('');
  } catch {
    container.innerHTML = '<div class="alert alert-error">Failed to load posts. Make sure the server is running.</div>';
  }
}

function renderPostCard(post) {
  return `
    <div class="post-card">
      <h3><a href="/post.html?id=${post.id}">${escHtml(post.title)}</a></h3>
      <p class="post-excerpt">${escHtml(excerpt(post.content))}</p>
      <div class="post-meta">
        <span>By <a href="/profile.html?id=${post.author_id}">${escHtml(post.author_name)}</a></span>
        <span>${formatDate(post.created_at)}</span>
        <span>${post.comment_count} comment${post.comment_count == 1 ? '' : 's'}</span>
      </div>
    </div>`;
}
