document.addEventListener('DOMContentLoaded', async () => {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }

  const id = qs('id');
  if (!id) {
    showAlert('msgBox', 'No post ID provided.');
    return;
  }

  document.getElementById('cancelLink').href = `/post.html?id=${id}`;

  try {
    const post = await api.posts.get(id);
    const me   = getUser();
    if (!me || me.id !== post.author_id) {
      showAlert('msgBox', 'You are not authorized to edit this post.');
      document.getElementById('editPostForm').style.display = 'none';
      return;
    }
    document.getElementById('title').value   = post.title;
    document.getElementById('content').value = post.content;
  } catch (err) {
    showAlert('msgBox', err.message);
    return;
  }

  document.getElementById('editPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = e.target.querySelector('button[type="submit"]');
    const title   = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    btn.disabled = true;
    btn.textContent = 'Saving…';
    document.getElementById('msgBox').innerHTML = '';

    try {
      await api.posts.update(id, { title, content });
      window.location.href = `/post.html?id=${id}`;
    } catch (err) {
      showAlert('msgBox', err.message);
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    }
  });
});
