// static/js/partidos.js

// ======================= Utilidades base =======================
const API = {
  get: async (url) => {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  send: async (url, method, body) => {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json().catch(() => ({}));
  },
};

const $ = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);

// Devuelve el primer select existente por una lista de posibles IDs
function pickSelect(candidates) {
  for (const id of candidates) {
    const el = byId(id);
    if (el) return el;
  }
  return null;
}

function fillSelect(selectEl, data, valueKey, labelKey) {
  if (!selectEl) return;
  selectEl.innerHTML = data
    .map((e) => `<option value="${e[valueKey]}">${e[labelKey]}</option>`)
    .join("");
}

function openModal(id) {
  const m = byId(id);
  if (!m) return;
  m.classList.add("open");
}
function closeModalById(id) {
  const m = byId(id);
  if (!m) return;
  m.classList.remove("open");
}

function showToast(msg, type = "info") {
  // Implementación simple; si ya tienes una en ui.js, puedes sustituirla
  alert((type === "error" ? "❌ " : type === "success" ? "✅ " : "") + msg);
}

// ======================= Estado en memoria =======================
let equiposCache = [];
let partidosCache = [];

// ======================= Carga de sesión mínima =======================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await initPartidosPantalla();
  } catch (e) {
    console.error(e);
    showToast("No fue posible inicializar la pantalla de partidos", "error");
  }
});

// ======================= Inicialización =======================
async function initPartidosPantalla() {
  // Botones
  const btnNuevo = byId("btn-nuevo-partido");
  const btnGuardar = byId("btn-guardar-partido");
  if (btnNuevo) {
    btnNuevo.addEventListener("click", () => {
      resetFormPartido();
      openModal("partido-modal");
    });
  }
  if (btnGuardar) {
    btnGuardar.addEventListener("click", guardarPartido);
  }

  // Cargar primero equipos; luego partidos
  await cargarEquipos();
  await cargarPartidos();
}

// ======================= Carga de datos =======================
async function cargarEquipos() {
  // Tu blueprint de equipos está definido con @equipos_bp.get("") → /api/equipos (sin “/” final)
  const url = "http://localhost:5000/api/equipos";
  const data = await API.get(url);
  equiposCache = Array.isArray(data) ? data : [];

  // Rellenar selects (tolerando IDs diferentes)
  const selLocal = pickSelect(["partido-local", "equipo-local"]);
  const selVisit = pickSelect(["partido-visitante", "equipo-visitante"]);
  fillSelect(selLocal, equiposCache, "id_equipo", "nombre");
  fillSelect(selVisit, equiposCache, "id_equipo", "nombre");

  console.log(`✅ ${equiposCache.length} equipos cargados correctamente.`);
}

async function cargarPartidos() {
  // En tu blueprint de partidos usas @partidos_bp.route("/", ...) → termina en “/”
  const url = "http://localhost:5000/api/partidos/";
  const data = await API.get(url);
  partidosCache = Array.isArray(data) ? data : [];
  console.log(`✅ ${partidosCache.length} partidos cargados correctamente.`);
  renderPartidos(partidosCache);
}

// ======================= Render de tabla =======================
function renderPartidos(data) {
  const tbody = $("#partidos-table tbody");
  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center muted">No hay partidos</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map((p) => {
      const fechaFmt = p.fecha_hora ? new Date(p.fecha_hora).toLocaleString("es-CO") : "-";
      return `
      <tr>
        <td>${p.id_partido}</td>
        <td>${fechaFmt}</td>
        <td>${p.jornada ?? "-"}</td>
        <td>${p.equipo_local ?? "-"}</td>
        <td>${p.equipo_visitante ?? "-"}</td>
        <td>-</td> <!-- Marcador (no usado) -->
        <td>${p.estado ?? "Programado"}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-secondary btn-sm" onclick="editarPartido(${p.id_partido})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarPartido(${p.id_partido})">🗑️</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");
}

// ======================= Form helpers =======================
function resetFormPartido() {
  const form = byId("partido-form");
  if (form) form.reset();

  // Asegura estado por defecto
  const selEstado = pickSelect(["partido-estado", "estado"]);
  if (selEstado && !selEstado.value) {
    selEstado.value = "Programado";
  }

  // Limpia atributo de edición
  const modal = byId("partido-modal");
  if (modal) modal.removeAttribute("data-edit-id");
}

function setFormPartido(data) {
  // Inputs (tolerando distintos IDs)
  const inpFecha = pickSelect(["partido-fecha", "fecha_hora"]);
  const inpJornada = pickSelect(["partido-jornada", "jornada"]);
  const selLocal = pickSelect(["partido-local", "equipo-local"]);
  const selVisit = pickSelect(["partido-visitante", "equipo-visitante"]);
  const selEstado = pickSelect(["partido-estado", "estado"]);

  // fecha_hora: si usas <input type="datetime-local"> debes pasar 'YYYY-MM-DDTHH:MM'
  if (inpFecha && data.fecha_hora) {
    try {
      const dt = new Date(data.fecha_hora);
      const iso = dt.toISOString().slice(0, 16);
      inpFecha.value = iso;
    } catch {
      inpFecha.value = "";
    }
  }

  if (inpJornada) inpJornada.value = data.jornada ?? "";
  if (selLocal) selLocal.value = data.id_equipo_local ?? "";
  if (selVisit) selVisit.value = data.id_equipo_visitante ?? "";
  if (selEstado) selEstado.value = data.estado ?? "Programado";
}

// ======================= CRUD =======================
async function guardarPartido() {
  // Detectar si es edición por atributo en el modal
  const modal = byId("partido-modal");
  const editId = modal?.getAttribute("data-edit-id");

  const inpFecha = pickSelect(["partido-fecha", "fecha_hora"]);
  const inpJornada = pickSelect(["partido-jornada", "jornada"]);
  const selLocal = pickSelect(["partido-local", "equipo-local"]);
  const selVisit = pickSelect(["partido-visitante", "equipo-visitante"]);
  const selEstado = pickSelect(["partido-estado", "estado"]);

  const fecha_hora = inpFecha?.value ? new Date(inpFecha.value).toISOString().slice(0, 19).replace("T", " ") : null;
  const jornada = inpJornada?.value ? parseInt(inpJornada.value, 10) : null;
  const id_equipo_local = selLocal?.value ? parseInt(selLocal.value, 10) : null;
  const id_equipo_visitante = selVisit?.value ? parseInt(selVisit.value, 10) : null;
  const estado = selEstado?.value || "Programado";

  if (!fecha_hora || !jornada) {
    showToast("Fecha y Jornada son obligatorios", "error");
    return;
  }

  const payload = {
    fecha_hora,
    jornada,
    estado,
    id_equipo_local,
    id_equipo_visitante,
  };

  try {
    if (editId) {
      await API.send(`http://localhost:5000/api/partidos/${editId}`, "PUT", payload);
      showToast("Partido actualizado correctamente", "success");
    } else {
      await API.send("http://localhost:5000/api/partidos/", "POST", payload);
      showToast("Partido creado correctamente", "success");
    }
    closeModalById("partido-modal");
    await cargarPartidos();
  } catch (e) {
    console.error("❌ Error al guardar partido:", e);
    showToast("No se pudo guardar el partido", "error");
  }
}

// Hacer global para que funcionen los botones en la tabla
window.editarPartido = function (id) {
  const partido = partidosCache.find((p) => p.id_partido === id);
  if (!partido) return;

  // Asegura que los selects tengan opciones antes de setear valores
  const selLocal = pickSelect(["partido-local", "equipo-local"]);
  const selVisit = pickSelect(["partido-visitante", "equipo-visitante"]);
  if (selLocal?.options?.length === 0 || selVisit?.options?.length === 0) {
    fillSelect(selLocal, equiposCache, "id_equipo", "nombre");
    fillSelect(selVisit, equiposCache, "id_equipo", "nombre");
  }

  setFormPartido(partido);

  const modal = byId("partido-modal");
  if (modal) modal.setAttribute("data-edit-id", String(id));

  openModal("partido-modal");
};

window.eliminarPartido = async function (id) {
  if (!confirm("¿Eliminar este partido?")) return;
  try {
    await API.send(`http://localhost:5000/api/partidos/${id}`, "DELETE");
    showToast("Partido eliminado correctamente", "success");
    await cargarPartidos();
  } catch (e) {
    console.error("❌ Error al eliminar partido:", e);
    showToast("No se pudo eliminar el partido", "error");
  }
};
