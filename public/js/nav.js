document.addEventListener('DOMContentLoaded', () => {
  const navAuth = document.getElementById('navAuth');
  if (!navAuth) return;

  const user = getUser();
  if (user) {
    navAuth.innerHTML = `
      <a href="/create-post.html" class="btn btn-outline btn-sm">+ New Post</a>
      <a href="/profile.html?id=${user.id}" class="btn btn-ghost btn-sm">${escHtml(user.username)}</a>
      <button onclick="doLogout()" class="btn btn-ghost btn-sm">Sign out</button>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="/login.html"    class="btn btn-ghost btn-sm">Sign in</a>
      <a href="/register.html" class="btn btn-primary btn-sm">Register</a>
    `;
  }
});

function doLogout() {
  clearAuth();
  window.location.href = '/index.html';
}
