document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    alert("Debes iniciar sesión para acceder.");
    window.location.href = "login.html";
    return;
  }

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
        console.log("Token válido:", data.data);
      }
    })
    .catch((err) => {
      console.error(err);
      localStorage.clear();
      window.location.href = "login.html";
    });
});

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    cargarEquiposReporte(),
    cargarJugadoresReporte(),
    cargarPartidosReporte()
  ]);
});

async function cargarEquiposReporte() {
  try {
    const temporadas = await TemporadasAPI.getAll();
    if (!temporadas || temporadas.length === 0) return;
    const tabla = await ReportesAPI.tablaPosiciones(temporadas[0].id_temporada);
    const labels = tabla.map(t => t.equipo);
    const data = tabla.map(t => t.puntos);
    const ctx = document.getElementById('chart-equipos');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Puntos', data }]
      }
    });
  } catch (error) {
    // si no hay back, no graficamos
  }
}

async function cargarJugadoresReporte() {
  try {
    const data = await ReportesAPI.topGoleadores();
    const labels = data.map(d => d.jugador);
    const goles = data.map(d => d.goles);
    const ctx = document.getElementById('chart-jugadores');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Goles', data: goles }]
      }
    });
  } catch (error) {}
}

async function cargarPartidosReporte() {
  try {
    const data = await ReportesAPI.partidosRecientes();
    const tbody = document.getElementById('reportes-partidos-body');
    tbody.innerHTML = data.map(p => `
      <tr>
        <td>${formatDate(p.fecha_hora)}</td>
        <td>${p.local}</td>
        <td>${p.visitante}</td>
        <td>${(p.goles_local ?? 0)} - ${(p.goles_visitante ?? 0)}</td>
        <td><span class="badge badge-${getStatusClass(p.estado)}">${p.estado}</span></td>
      </tr>
    `).join('');
  } catch (error) {
    document.getElementById('reportes-partidos-body').innerHTML = '<tr><td colspan="5" class="text-center muted">No hay datos</td></tr>';
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}
function getStatusClass(estado) {
  return { 'PROGRAMADO': 'info', 'JUGADO': 'success', 'SUSPENDIDO': 'error' }[estado] || 'info';
}
