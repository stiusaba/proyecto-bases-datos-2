document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('logictech_user') || sessionStorage.getItem('logictech_user');
  if (user) {
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('login-form');
  const btn = document.getElementById('login-btn');
  const text = document.getElementById('login-text');
  const spinner = document.getElementById('login-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember-me').checked;

    document.getElementById('username-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    if (!username) {
      document.getElementById('username-error').textContent = 'El usuario es requerido';
      return;
    }
    if (!password || password.length < 6) {
      document.getElementById('password-error').textContent = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    btn.disabled = true;
    text.classList.add('d-none');
    spinner.classList.remove('d-none');

    try {
      // Aquí se usará el back real:
      // const data = await AuthAPI.login({ username, password });
      await new Promise(r => setTimeout(r, 900)); // simulación
      const payload = { username, loginTime: new Date().toISOString() };
      if (remember) {
        localStorage.setItem('logictech_user', JSON.stringify(payload));
      } else {
        sessionStorage.setItem('logictech_user', JSON.stringify(payload));
      }
      showToast('¡Login exitoso! Redirigiendo...', 'success');
      setTimeout(() => window.location.href = 'index.html', 800);
    } catch (err) {
      showToast(err.message || 'Error al iniciar sesión', 'error');
    } finally {
      btn.disabled = false;
      text.classList.remove('d-none');
      spinner.classList.add('d-none');
    }
  });
});
