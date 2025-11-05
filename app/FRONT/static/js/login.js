document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
  // Guardar token y usuario
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  alert("✅ Inicio de sesión exitoso.");
  window.location.href = "index.html";
} else {
  alert("❌ " + (data.error || "Credenciales incorrectas o sin token."));
}

    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    }
  });
});
