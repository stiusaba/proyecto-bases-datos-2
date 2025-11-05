// static/js/noticias.js
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    alert("Debes iniciar sesión para acceder.");
    window.location.href = "login.html";
    return;
  }

  // Verificar sesión con el backend
  fetch("http://localhost:5000/api/auth/profile", {
    method: "GET",
    headers: { Authorization: token },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        alert("Sesión expirada, vuelve a iniciar sesión.");
        localStorage.clear();
        window.location.href = "login.html";
      } else {
        console.log("✅ Sesión válida:", data.data);
      }
    })
    .catch((err) => {
      console.error("❌ Error validando sesión:", err);
      localStorage.clear();
      window.location.href = "login.html";
    });
});

document.addEventListener("DOMContentLoaded", async () => {
  await cargarNoticias();

  document.getElementById("btn-nueva-noticia").addEventListener("click", () => {
    document.getElementById("noticia-form").reset();
    document.getElementById("noticia-id").value = "";
    document.getElementById("noticia-modal-title").textContent = "Nueva noticia";
    openModal("noticia-modal");
  });

  document.getElementById("btn-guardar-noticia").addEventListener("click", guardarNoticia);
  document.getElementById("search-noticias").addEventListener("input", filtrarNoticias);
});

let noticiasCache = [];

/* ======================================================
   ✅ Cargar lista de noticias desde el backend
====================================================== */
async function cargarNoticias() {
  try {
    noticiasCache = await NoticiasAPI.getAll();
    renderNoticias(noticiasCache);
  } catch (error) {
    console.error("❌ Error al cargar noticias:", error);
    showToast("No fue posible cargar las noticias", "error");
  }
}

/* ======================================================
   ✅ Renderizar la tabla
====================================================== */
function renderNoticias(data) {
  const tbody = document.querySelector("#noticias-table tbody");
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center muted">No hay noticias</td></tr>`;
    return;
  }
  tbody.innerHTML = data
    .map(
      (n) => `
    <tr>
      <td>${n.id_noticia || n.id || ""}</td>
      <td>${n.titulo || ""}</td>
      <td>${n.contenido || "-"}</td>
      <td>${n.autor || "-"}</td>
      <td>${n.categoria || "-"}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-secondary btn-sm" onclick="editarNoticia(${n.id_noticia || n.id})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarNoticia(${n.id_noticia || n.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `
    )
    .join("");
}

/* ======================================================
   ✅ Filtro de búsqueda
====================================================== */
function filtrarNoticias(e) {
  const q = e.target.value.toLowerCase();
  const data = noticiasCache.filter((n) => (n.titulo || "").toLowerCase().includes(q));
  renderNoticias(data);
}

/* ======================================================
   ✅ Editar noticia
====================================================== */
function editarNoticia(id) {
  const n = noticiasCache.find((x) => (x.id_noticia || x.id) == id);
  if (!n) return;
  document.getElementById("noticia-id").value = n.id_noticia || n.id;
  document.getElementById("noticia-titulo").value = n.titulo || "";
  document.getElementById("noticia-contenido").value = n.contenido || "";
  document.getElementById("noticia-autor").value = n.autor || "";
  document.getElementById("noticia-categoria").value = n.categoria || "";
  document.getElementById("noticia-modal-title").textContent = "Editar noticia";
  openModal("noticia-modal");
}

/* ======================================================
   ✅ Crear o actualizar noticia
====================================================== */
async function guardarNoticia() {
  const id = document.getElementById("noticia-id").value;
  const data = {
    titulo: document.getElementById("noticia-titulo").value.trim(),
    contenido: document.getElementById("noticia-contenido").value.trim(),
    autor: document.getElementById("noticia-autor").value.trim(),
    categoria: document.getElementById("noticia-categoria").value.trim(),
  };

  if (!data.titulo || !data.contenido) {
    showToast("El título y el contenido son obligatorios", "error");
    return;
  }

  try {
    if (id) {
      // ✅ Actualizar
      await NoticiasAPI.update(id, data);
      showToast("Noticia actualizada correctamente", "success");
    } else {
      // ✅ Crear
      await NoticiasAPI.create(data);
      showToast("Noticia creada correctamente", "success");
    }

    closeModalById("noticia-modal");
    await cargarNoticias(); // recarga desde backend
  } catch (error) {
    console.error("❌ Error guardando noticia:", error);
    showToast(error.message || "Error al guardar la noticia", "error");
  }
}

/* ======================================================
   ✅ Eliminar noticia
====================================================== */
async function eliminarNoticia(id) {
  if (!confirm("¿Seguro que deseas eliminar esta noticia?")) return;

  try {
    await NoticiasAPI.delete(id);
    showToast("Noticia eliminada correctamente", "success");
    await cargarNoticias();
  } catch (error) {
    console.error("❌ Error al eliminar noticia:", error);
    showToast(error.message || "No se pudo eliminar la noticia", "error");
  }
}
