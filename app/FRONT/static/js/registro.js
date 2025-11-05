document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!nombre || !email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registro exitoso, ahora puedes iniciar sesión.");
        window.location.href = "login.html";
      } else {
        alert("❌ " + (data.error || "Error en el registro."));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    }
  });
});
