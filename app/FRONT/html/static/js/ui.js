function showToast(message, type = 'error') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : '❌'}</div>
    <div class="toast-message">${message}</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}
function closeModalById(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close-modal]')) {
    e.target.closest('.modal-overlay').style.display = 'none';
  }
});

function fillSelect(selectId, items, valueKey = 'id', labelKey = 'nombre') {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '';
  items.forEach(i => {
    const opt = document.createElement('option');
    opt.value = i[valueKey];
    opt.textContent = i[labelKey];
    sel.appendChild(opt);
  });
}

function logout() {
  localStorage.removeItem('logictech_user');
  sessionStorage.removeItem('logictech_user');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });

  const passToggles = document.querySelectorAll('[data-toggle-pass]');
  passToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else {
        input.type = 'password';
        btn.textContent = '👁️';
      }
    });
  });
});
