document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const btn = document.getElementById('reg-btn');
  const text = document.getElementById('reg-text');
  const spinner = document.getElementById('reg-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;

    document.querySelectorAll('.form-error').forEach(d => d.textContent = '');

    if (!nombre) { document.getElementById('reg-nombre-error').textContent = 'Campo requerido'; return; }
    if (!username) { document.getElementById('reg-username-error').textContent = 'Campo requerido'; return; }
    if (!email) { document.getElementById('reg-email-error').textContent = 'Campo requerido'; return; }
    if (pass.length < 6) { document.getElementById('reg-pass-error').textContent = 'Mínimo 6 caracteres'; return; }
    if (pass !== pass2) { document.getElementById('reg-pass2-error').textContent = 'Las contraseñas no coinciden'; return; }

    btn.disabled = true;
    text.classList.add('d-none');
    spinner.classList.remove('d-none');

    try {
      // await AuthAPI.register({ nombre, username, email, password: pass });
      await new Promise(r => setTimeout(r, 900));
      showToast('Usuario registrado. Ahora inicia sesión.', 'success');
      setTimeout(() => window.location.href = 'login.html', 1000);
    } catch (err) {
      showToast(err.message || 'Error al registrar', 'error');
    } finally {
      btn.disabled = false;
      text.classList.remove('d-none');
      spinner.classList.add('d-none');
    }
  });
});
