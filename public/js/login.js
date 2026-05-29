document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    window.location.href = '/index.html';
    return;
  }

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn   = e.target.querySelector('button[type="submit"]');
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    btn.disabled = true;
    btn.textContent = 'Signing in…';
    document.getElementById('msgBox').innerHTML = '';

    try {
      const data = await api.auth.login({ email, password });
      setAuth(data.token, data.user);
      window.location.href = '/index.html';
    } catch (err) {
      showAlert('msgBox', err.message);
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  });
});
