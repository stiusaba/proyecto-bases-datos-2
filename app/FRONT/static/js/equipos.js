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
  await cargarEquipos();

  document.getElementById("btn-nuevo-equipo").addEventListener("click", () => {
    document.getElementById("equipo-form").reset();
    document.getElementById("equipo-id").value = "";
    document.getElementById("equipo-modal-title").textContent = "Nuevo equipo";
    openModal("equipo-modal");
  });

  document.getElementById("btn-guardar-equipo").addEventListener("click", guardarEquipo);
  document.getElementById("search-equipos").addEventListener("input", filtrarEquipos);
});

let equiposCache = [];

/* ======================================================
   ✅ Cargar lista de equipos desde el backend
====================================================== */
async function cargarEquipos() {
  try {
    equiposCache = await EquiposAPI.getAll();
    renderEquipos(equiposCache);
  } catch (error) {
    console.error("❌ Error al cargar equipos:", error);
    showToast("No fue posible cargar los equipos", "error");
  }
}

/* ======================================================
   ✅ Renderizar la tabla
====================================================== */
function renderEquipos(data) {
  const tbody = document.querySelector("#equipos-table tbody");
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center muted">No hay equipos</td></tr>`;
    return;
  }
  tbody.innerHTML = data
    .map(
      (e) => `
    <tr>
      <td>${e.id_equipo || e.id || ""}</td>
      <td>${e.nombre || ""}</td>
      <td>${e.ciudad || "-"}</td>
      <td>${e.estadio || "-"}</td>
      <td>${(e.presupuesto || 0).toLocaleString("es-CO")}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-secondary btn-sm" onclick="editarEquipo(${e.id_equipo || e.id})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarEquipo(${e.id_equipo || e.id})">🗑️</button>
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
function filtrarEquipos(e) {
  const q = e.target.value.toLowerCase();
  const data = equiposCache.filter((eq) => (eq.nombre || "").toLowerCase().includes(q));
  renderEquipos(data);
}

/* ======================================================
   ✅ Editar equipo
====================================================== */
function editarEquipo(id) {
  const e = equiposCache.find((x) => (x.id_equipo || x.id) == id);
  if (!e) return;
  document.getElementById("equipo-id").value = e.id_equipo || e.id;
  document.getElementById("equipo-nombre").value = e.nombre || "";
  document.getElementById("equipo-ciudad").value = e.ciudad || "";
  document.getElementById("equipo-estadio").value = e.estadio || "";
  document.getElementById("equipo-presupuesto").value = e.presupuesto || "";
  document.getElementById("equipo-modal-title").textContent = "Editar equipo";
  openModal("equipo-modal");
}

/* ======================================================
   ✅ Crear o actualizar equipo
====================================================== */
async function guardarEquipo() {
  const id = document.getElementById("equipo-id").value;
  const data = {
    nombre: document.getElementById("equipo-nombre").value.trim(),
    ciudad: document.getElementById("equipo-ciudad").value.trim(),
    estadio: document.getElementById("equipo-estadio").value.trim(),
    presupuesto: parseFloat(document.getElementById("equipo-presupuesto").value) || 0,
  };

  if (!data.nombre) {
    showToast("El nombre es obligatorio", "error");
    return;
  }

  try {
    if (id) {
      // ✅ Actualizar
      await EquiposAPI.update(id, data);
      showToast("Equipo actualizado correctamente", "success");
    } else {
      // ✅ Crear
      await EquiposAPI.create(data);
      showToast("Equipo creado correctamente", "success");
    }

    closeModalById("equipo-modal");
    await cargarEquipos(); // recarga desde backend
  } catch (error) {
    console.error("❌ Error guardando equipo:", error);
    showToast(error.message || "Error al guardar el equipo", "error");
  }
}

/* ======================================================
   ✅ Eliminar equipo
====================================================== */
async function eliminarEquipo(id) {
  if (!confirm("¿Seguro que deseas eliminar este equipo?")) return;

  try {
    await EquiposAPI.delete(id);
    showToast("Equipo eliminado correctamente", "success");
    await cargarEquipos();
  } catch (error) {
    console.error("❌ Error al eliminar equipo:", error);
    showToast(error.message || "No se pudo eliminar el equipo", "error");
  }
}
