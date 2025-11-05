document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    console.warn("Token o usuario no encontrados. Redirigiendo al login...");
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
        console.warn("Token inválido o expirado. Redirigiendo al login...");
        localStorage.clear();
        window.location.href = "login.html";
      } else {
        console.log("✅ Token válido. Usuario autenticado:", data.data);
      }
    })
    .catch((err) => {
      console.error("Error validando token:", err);
      localStorage.clear();
      window.location.href = "login.html";
    });
});


document.addEventListener('DOMContentLoaded', async () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.href = 'login.html';
    return;
  }

  const user = JSON.parse(userStr);
  const nameEl = document.getElementById('user-name');
  const avatarEl = document.getElementById('user-avatar');

  if (nameEl) nameEl.textContent = user.nombre || user.email;
  if (avatarEl) avatarEl.textContent = (user.nombre || user.email || 'AD').substring(0, 2).toUpperCase();

  await Promise.all([
    loadStats(),
    loadTablaPosiciones(),
    loadTopGoleadores(),
    loadRecentMatches()
  ]).catch(err => console.error(err));
});


  await Promise.all([
    loadStats(),
    loadTablaPosiciones(),
    loadTopGoleadores(),
    loadRecentMatches()
  ]).catch(err => console.error(err));


async function loadStats() {
  try {
    const data = await ReportesAPI.dashboardStats();
    document.getElementById('stat-equipos').textContent = data.equipos || 0;
    document.getElementById('stat-jugadores').textContent = data.jugadores || 0;
    document.getElementById('stat-partidos').textContent = data.partidos || 0;
    document.getElementById('stat-noticias').textContent = data.noticias || 0;
  } catch (error) {
    // si el back no existe todavía, sólo dejamos ceros
  }
}

async function loadTablaPosiciones() {
  try {
    const temporadas = await TemporadasAPI.getAll();
    if (!temporadas || temporadas.length === 0) {
      document.getElementById('tabla-posiciones').innerHTML = '<p class="muted">No hay temporadas</p>';
      return;
    }
    const tabla = await ReportesAPI.tablaPosiciones(temporadas[0].id_temporada);
    if (!tabla || tabla.length === 0) {
      document.getElementById('tabla-posiciones').innerHTML = '<p class="muted">No hay datos</p>';
      return;
    }
    const rows = tabla.map((t, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${t.equipo || 'Equipo'}</strong></td>
        <td><strong>${t.puntos || 0}</strong></td>
        <td>${t.partidos_jugados || 0}</td>
        <td>${t.ganados || 0}</td>
        <td>${t.empatados || 0}</td>
        <td>${t.perdidos || 0}</td>
      </tr>
    `).join('');
    document.getElementById('tabla-posiciones').innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Pos</th><th>Equipo</th><th>Pts</th><th>PJ</th><th>G</th><th>E</th><th>P</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  } catch (error) {
    console.error('Error loading tabla posiciones:', error);
  }
}

async function loadTopGoleadores() {
  try {
    const data = await ReportesAPI.topGoleadores();
    const container = document.getElementById('top-goleadores');
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="muted">No hay datos</p>';
      return;
    }
    container.innerHTML = data.map((j, idx) => `
      <div class="match-card">
        <div class="flex-between">
          <span><strong>${idx + 1}.</strong> ${j.jugador || 'Jugador'}</span>
          <span class="badge badge-success">${j.goles || 0} goles</span>
        </div>
        <div class="muted" style="margin-top:.3rem;">${j.equipo || 'Equipo'}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading top goleadores:', error);
  }
}

async function loadRecentMatches() {
  try {
    const data = await ReportesAPI.partidosRecientes();
    const container = document.getElementById('recent-matches');
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="muted">No hay partidos</p>';
      return;
    }
    container.innerHTML = data.map((p) => `
      <div class="match-card">
        <div class="flex-between" style="margin-bottom:.3rem;">
          <div class="muted">${formatDate(p.fecha_hora)}</div>
          <span class="badge badge-${getStatusClass(p.estado)}">${p.estado}</span>
        </div>
        <div><strong>${p.local || 'Equipo Local'}</strong> vs <strong>${p.visitante || 'Equipo Visitante'}</strong></div>
        <div class="muted" style="margin-top:.35rem;">${(p.goles_local ?? 0)} - ${(p.goles_visitante ?? 0)}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading recent matches:', error);
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

function getStatusClass(estado) {
  return { 'PROGRAMADO': 'info', 'JUGADO': 'success', 'SUSPENDIDO': 'error' }[estado] || 'info';
}
