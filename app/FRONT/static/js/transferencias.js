document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    alert("Debes iniciar sesión para acceder.");
    window.location.href = "login.html";
    return;
  }

  await initTransferencias();
});

let transferCache = [];
let jugadoresT = [];
let equiposT = [];

async function initTransferencias() {
  await Promise.all([cargarDataTransfer(), cargarTransferencias()]);

  document.getElementById("btn-nueva-transferencia").addEventListener("click", () => {
    document.getElementById("transfer-form").reset();
    document.getElementById("transfer-id").value = "";
    document.getElementById("transfer-modal-title").textContent = "Registrar transferencia";
    openModal("transfer-modal");
  });

  document.getElementById("btn-guardar-transferencia").addEventListener("click", guardarTransferencia);
}

async function cargarDataTransfer() {
  try {
    jugadoresT = await JugadoresAPI.getAll();
    equiposT = await EquiposAPI.getAll();
    fillSelect("transfer-jugador", jugadoresT, "id_jugador", "nombre");
    fillSelect("transfer-desde", equiposT, "id_equipo", "nombre");
    fillSelect("transfer-hacia", equiposT, "id_equipo", "nombre");
  } catch (error) {
    console.error("❌ Error cargando datos:", error);
    showToast("Error cargando jugadores o equipos", "error");
  }
}

async function cargarTransferencias() {
  try {
    const res = await fetch("http://localhost:5000/api/transferencias/");
    if (!res.ok) throw new Error("Error al obtener transferencias");
    transferCache = await res.json();
    renderTransferencias(transferCache);
  } catch (error) {
    console.error("❌ Error cargando transferencias:", error);
    showToast("No se pudieron cargar las transferencias", "error");
  }
}

function renderTransferencias(data) {
  const tbody = document.querySelector("#transfer-table tbody");
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center muted">No hay transferencias</td></tr>';
    return;
  }
  tbody.innerHTML = data
    .map(
      (t) => `
    <tr>
      <td>${t.id_transferencia}</td>
      <td>${t.jugador || getNombreJugador(t.id_jugador)}</td>
      <td>${t.equipo_origen || getNombreEquipo(t.desde)}</td>
      <td>${t.equipo_destino || getNombreEquipo(t.hacia)}</td>
      <td>${(t.monto || 0).toLocaleString("es-CO")}</td>
      <td>${formatDate(t.fecha)}</td>
      <td>${t.estado || "PENDIENTE"}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editarTransferencia(${t.id_transferencia})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarTransferencia(${t.id_transferencia})">🗑️</button>
      </td>
    </tr>`
    )
    .join("");
}

function getNombreJugador(id) {
  const j = jugadoresT.find((x) => x.id_jugador == id);
  return j ? j.nombre : "-";
}
function getNombreEquipo(id) {
  const e = equiposT.find((x) => x.id_equipo == id);
  return e ? e.nombre : "-";
}

function editarTransferencia(id) {
  const t = transferCache.find((x) => x.id_transferencia == id);
  if (!t) return;
  document.getElementById("transfer-id").value = t.id_transferencia;
  document.getElementById("transfer-jugador").value = t.id_jugador;
  document.getElementById("transfer-desde").value = t.desde;
  document.getElementById("transfer-hacia").value = t.hacia;
  document.getElementById("transfer-monto").value = t.monto || 0;
  document.getElementById("transfer-fecha").value = t.fecha ? t.fecha.slice(0, 10) : "";
  document.getElementById("transfer-modal-title").textContent = "Editar transferencia";
  openModal("transfer-modal");
}

async function guardarTransferencia() {
  const id = document.getElementById("transfer-id").value;
  const data = {
    id_jugador: parseInt(document.getElementById("transfer-jugador").value),
    desde: parseInt(document.getElementById("transfer-desde").value),
    hacia: parseInt(document.getElementById("transfer-hacia").value),
    monto: parseFloat(document.getElementById("transfer-monto").value) || 0,
    fecha: document.getElementById("transfer-fecha").value || new Date().toISOString(),
    estado: "PENDIENTE",
  };

  if (!data.id_jugador || !data.desde || !data.hacia) {
    showToast("Jugador y equipos son obligatorios", "error");
    return;
  }

  try {
    const url = id
      ? `http://localhost:5000/api/transferencias/${id}`
      : "http://localhost:5000/api/transferencias/";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al guardar transferencia");
    showToast(id ? "Transferencia actualizada" : "Transferencia creada", "success");
    closeModalById("transfer-modal");
    await cargarTransferencias();
  } catch (error) {
    console.error(error);
    showToast("Error al guardar transferencia", "error");
  }
}

async function eliminarTransferencia(id) {
  if (!confirm("¿Eliminar transferencia?")) return;
  try {
    const res = await fetch(`http://localhost:5000/api/transferencias/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar transferencia");
    showToast("Transferencia eliminada correctamente", "success");
    await cargarTransferencias();
  } catch (error) {
    console.error(error);
    showToast("Error al eliminar transferencia", "error");
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("es-CO");
}
