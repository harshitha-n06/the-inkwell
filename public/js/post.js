let currentPost = null;

document.addEventListener('DOMContentLoaded', async () => {
  const id = qs('id');
  if (!id) {
    document.getElementById('postContent').innerHTML =
      '<div class="alert alert-error">No post ID specified.</div>';
    return;
  }
  await loadPost(id);
});

async function loadPost(id) {
  try {
    const post = await api.posts.get(id);
    currentPost = post;
    renderPost(post);
    renderComments(post);
  } catch (err) {
    document.getElementById('postContent').innerHTML =
      `<div class="alert alert-error">${escHtml(err.message)}</div>`;
  }
}

function renderPost(post) {
  const me = getUser();
  const isOwner = me && me.id === post.author_id;
  document.title = `${post.title} — The Inkwell`;

  document.getElementById('postContent').innerHTML = `
    <div class="post-detail-header">
      <h1>${escHtml(post.title)}</h1>
      <div class="post-meta">
        <span>By <a href="/profile.html?id=${post.author_id}">${escHtml(post.author_name)}</a></span>
        <span>${formatDate(post.created_at)}</span>
      </div>
      ${isOwner ? `
        <div class="post-detail-actions">
          <a href="/edit-post.html?id=${post.id}" class="btn btn-outline btn-sm">Edit</a>
          <button onclick="deletePost(${post.id})" class="btn btn-danger btn-sm">Delete</button>
        </div>` : ''}
    </div>
    <div class="post-body">${escHtml(post.content)}</div>
  `;
}

function renderComments(post) {
  const section = document.getElementById('commentsSection');
  const list    = document.getElementById('commentList');
  const me      = getUser();

  section.style.display = '';
  document.getElementById('commentHeading').textContent =
    `${post.comments.length} Comment${post.comments.length !== 1 ? 's' : ''}`;

  if (!post.comments.length) {
    list.innerHTML = '<p style="color:var(--muted);font-size:.9rem">No comments yet. Be the first!</p>';
  } else {
    list.innerHTML = post.comments.map(c => renderComment(c, me)).join('');
  }

  if (me) {
    document.getElementById('commentFormWrap').style.display = '';
    document.getElementById('submitComment').onclick = submitComment;
  } else {
    document.getElementById('commentLoginNote').style.display = '';
  }
}

function renderComment(c, me) {
  const isOwner = me && me.id === c.author_id;
  return `
    <div class="comment-card" id="comment-${c.id}">
      <div class="comment-header">
        <span class="comment-author">
          <a href="/profile.html?id=${c.author_id}" style="text-decoration:none;color:inherit">${escHtml(c.author_name)}</a>
        </span>
        <div style="display:flex;align-items:center;gap:.5rem">
          <span class="comment-date">${formatDate(c.created_at)}</span>
          ${isOwner ? `<button onclick="deleteComment(${c.post_id || currentPost.id},${c.id})" class="btn btn-ghost btn-sm" style="color:#dc2626;padding:0 .25rem">✕</button>` : ''}
        </div>
      </div>
      <div class="comment-body">${escHtml(c.content)}</div>
    </div>`;
}

async function submitComment() {
  const textarea = document.getElementById('commentText');
  const content  = textarea.value.trim();
  if (!content) return;

  const btn = document.getElementById('submitComment');
  btn.disabled = true;
  document.getElementById('commentMsg').innerHTML = '';

  try {
    const comment = await api.posts.addComment(currentPost.id, { content });
    textarea.value = '';
    const me = getUser();

    const list = document.getElementById('commentList');
    if (list.querySelector('p')) list.innerHTML = '';
    list.insertAdjacentHTML('beforeend', renderComment({ ...comment, post_id: currentPost.id }, me));

    const heading = document.getElementById('commentHeading');
    const count = document.querySelectorAll('.comment-card').length;
    heading.textContent = `${count} Comment${count !== 1 ? 's' : ''}`;
  } catch (err) {
    showAlert('commentMsg', err.message);
  } finally {
    btn.disabled = false;
  }
}

async function deleteComment(postId, commentId) {
  if (!confirm('Delete this comment?')) return;
  try {
    await api.posts.deleteComment(postId, commentId);
    document.getElementById(`comment-${commentId}`)?.remove();
    const count = document.querySelectorAll('.comment-card').length;
    document.getElementById('commentHeading').textContent =
      `${count} Comment${count !== 1 ? 's' : ''}`;
    if (!count) {
      document.getElementById('commentList').innerHTML =
        '<p style="color:var(--muted);font-size:.9rem">No comments yet. Be the first!</p>';
    }
  } catch (err) {
    alert(err.message);
  }
}

async function deletePost(id) {
  if (!confirm('Permanently delete this post? This cannot be undone.')) return;
  try {
    await api.posts.delete(id);
    window.location.href = '/index.html';
  } catch (err) {
    alert(err.message);
  }
}
