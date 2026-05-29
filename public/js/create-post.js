document.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('createPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = e.target.querySelector('button[type="submit"]');
    const title   = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
      showAlert('msgBox', 'Title and content are required.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Publishing…';
    document.getElementById('msgBox').innerHTML = '';

    try {
      const post = await api.posts.create({ title, content });
      window.location.href = `/post.html?id=${post.id}`;
    } catch (err) {
      showAlert('msgBox', err.message);
      btn.disabled = false;
      btn.textContent = 'Publish Post';
    }
  });
});
