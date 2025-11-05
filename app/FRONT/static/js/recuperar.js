document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recuperar-form');
  const btn = document.getElementById('rec-btn');
  const text = document.getElementById('rec-text');
  const spinner = document.getElementById('rec-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = document.getElementById('rec-email').value.trim();
    if (!value) {
      document.getElementById('rec-email-error').textContent = 'Campo requerido';
      return;
    }
    document.getElementById('rec-email-error').textContent = '';

    btn.disabled = true;
    text.classList.add('d-none');
    spinner.classList.remove('d-none');

    try {
      // await AuthAPI.forgot({ identifier: value });
      await new Promise(r => setTimeout(r, 900));
      showToast('Si el usuario existe, se enviará un correo.', 'success');
    } catch (err) {
      showToast(err.message || 'Error al enviar solicitud', 'error');
    } finally {
      btn.disabled = false;
      text.classList.remove('d-none');
      spinner.classList.add('d-none');
    }
  });
});
