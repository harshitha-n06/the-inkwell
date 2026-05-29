document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    window.location.href = '/index.html';
    return;
  }

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = e.target.querySelector('button[type="submit"]');
    const username = document.getElementById('username').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (username.length < 2) {
      showAlert('msgBox', 'Username must be at least 2 characters.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Creating account…';
    document.getElementById('msgBox').innerHTML = '';

    try {
      const data = await api.auth.register({ username, email, password });
      setAuth(data.token, data.user);
      window.location.href = '/index.html';
    } catch (err) {
      showAlert('msgBox', err.message);
      btn.disabled = false;
      btn.textContent = 'Create Account';
    }
  });
});
