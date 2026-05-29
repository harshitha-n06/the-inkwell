/* ─── Token / user helpers ─────────────────────────────── */
function getToken()  { return localStorage.getItem('inkwell_token'); }
function getUser()   { const u = localStorage.getItem('inkwell_user'); return u ? JSON.parse(u) : null; }
function isLoggedIn(){ return !!getToken(); }

function setAuth(token, user) {
  localStorage.setItem('inkwell_token', token);
  localStorage.setItem('inkwell_user', JSON.stringify(user));
}
function clearAuth() {
  localStorage.removeItem('inkwell_token');
  localStorage.removeItem('inkwell_user');
}

/* ─── Fetch wrapper ────────────────────────────────────── */
async function apiFetch(path, options = {}) {
  const token   = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch('/api' + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/* ─── API object ───────────────────────────────────────── */
const api = {
  auth: {
    register : (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login    : (body) => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
    me       : ()     => apiFetch('/auth/me'),
  },
  posts: {
    list        : ()         => apiFetch('/posts'),
    get         : (id)       => apiFetch(`/posts/${id}`),
    create      : (body)     => apiFetch('/posts',         { method: 'POST',   body: JSON.stringify(body) }),
    update      : (id, body) => apiFetch(`/posts/${id}`,   { method: 'PATCH',  body: JSON.stringify(body) }),
    delete      : (id)       => apiFetch(`/posts/${id}`,   { method: 'DELETE' }),
    search      : (q)        => apiFetch(`/posts/search?q=${encodeURIComponent(q)}`),
    stats       : ()         => apiFetch('/posts/stats/summary'),
    addComment  : (postId, body)              => apiFetch(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(body) }),
    deleteComment: (postId, commentId)        => apiFetch(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),
  },
  users: {
    profile: (id) => apiFetch(`/users/${id}`),
  },
};

/* ─── Helpers ──────────────────────────────────────────── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function excerpt(text, len = 160) {
  const plain = text.replace(/\s+/g, ' ').trim();
  return plain.length <= len ? plain : plain.slice(0, len).replace(/\s\S*$/, '') + '…';
}

function highlight(text, query) {
  if (!query) return escHtml(text);
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escHtml(text).replace(new RegExp(safe, 'gi'), m => `<mark>${m}</mark>`);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showAlert(containerId, message, type = 'error') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${escHtml(message)}</div>`;
}

function qs(param) {
  return new URLSearchParams(window.location.search).get(param);
}
