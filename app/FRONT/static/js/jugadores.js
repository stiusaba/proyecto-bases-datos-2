let jugadoresCache = [];
let equiposParaJugadores = [];

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([cargarEquiposParaJugadores(), cargarJugadores()]);
  document.getElementById('btn-nuevo-jugador').addEventListener('click', () => {
    document.getElementById('jugador-form').reset();
    document.getElementById('jugador-id').value = '';
    document.getElementById('jugador-modal-title').textContent = 'Nuevo jugador';
    openModal('jugador-modal');
  });
  document.getElementById('btn-guardar-jugador').addEventListener('click', guardarJugador);
  document.getElementById('search-jugadores').addEventListener('input', filtrarJugadores);
});

async function cargarEquiposParaJugadores() {
  try {
    equiposParaJugadores = await EquiposAPI.getAll();
  } catch (error) {
    equiposParaJugadores = [{ id_equipo: 1, nombre: 'Equipo Demo' }];
  }
  fillSelect('jugador-equipo', equiposParaJugadores, 'id_equipo', 'nombre');
}

async function cargarJugadores() {
  try {
    jugadoresCache = await JugadoresAPI.getAll();
  } catch (error) {
    jugadoresCache = [
      { id_jugador: 1, nombre: 'Jugador Demo', posicion: 'Delantero', id_equipo: 1, dorsal: 9, goles: 4 }
    ];
  }
  renderJugadores(jugadoresCache);
}

function renderJugadores(data) {
  const tbody = document.querySelector('#jugadores-table tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center muted">No hay jugadores</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(j => `
    <tr>
      <td>${j.id_jugador || j.id || ''}</td>
      <td>${j.nombre || ''}</td>
      <td>${j.posicion || '-'}</td>
      <td>${getNombreEquipo(j.id_equipo)}</td>
      <td>${j.dorsal || '-'}</td>
      <td>${j.goles || 0}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editarJugador(${j.id_jugador || j.id})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarJugador(${j.id_jugador || j.id})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function getNombreEquipo(id) {
  const e = equiposParaJugadores.find(eq => (eq.id_equipo || eq.id) == id);
  return e ? e.nombre : '-';
}

function filtrarJugadores(e) {
  const q = e.target.value.toLowerCase();
  const data = jugadoresCache.filter(j => (j.nombre || '').toLowerCase().includes(q));
  renderJugadores(data);
}

function editarJugador(id) {
  const j = jugadoresCache.find(x => (x.id_jugador || x.id) == id);
  if (!j) return;
  document.getElementById('jugador-id').value = j.id_jugador || j.id;
  document.getElementById('jugador-nombre').value = j.nombre || '';
  document.getElementById('jugador-posicion').value = j.posicion || 'Delantero';
  document.getElementById('jugador-equipo').value = j.id_equipo || '';
  document.getElementById('jugador-dorsal').value = j.dorsal || '';
  document.getElementById('jugador-goles').value = j.goles || 0;
  document.getElementById('jugador-modal-title').textContent = 'Editar jugador';
  openModal('jugador-modal');
}

async function guardarJugador() {
  const id = document.getElementById('jugador-id').value;
  const data = {
    nombre: document.getElementById('jugador-nombre').value.trim(),
    posicion: document.getElementById('jugador-posicion').value,
    id_equipo: parseInt(document.getElementById('jugador-equipo').value),
    dorsal: parseInt(document.getElementById('jugador-dorsal').value) || null,
    goles: parseInt(document.getElementById('jugador-goles').value) || 0
  };
  if (!data.nombre) {
    showToast('El nombre es obligatorio', 'error');
    return;
  }
  try {
    if (id) {
      await JugadoresAPI.update(id, data);
      const idx = jugadoresCache.findIndex(j => (j.id_jugador || j.id) == id);
      if (idx >= 0) jugadoresCache[idx] = { ...jugadoresCache[idx], ...data };
      showToast('Jugador actualizado', 'success');
    } else {
      const created = await JugadoresAPI.create(data);
      jugadoresCache.push(created);
      showToast('Jugador creado', 'success');
    }
    renderJugadores(jugadoresCache);
    closeModalById('jugador-modal');
  } catch (error) {
    // sin backend
    if (!id) {
      jugadoresCache.push({ ...data, id_jugador: Date.now() });
      renderJugadores(jugadoresCache);
      closeModalById('jugador-modal');
      showToast('Jugador creado localmente (sin back)', 'info');
    } else {
      showToast(error.message, 'error');
    }
  }
}

async function eliminarJugador(id) {
  if (!confirm('¿Eliminar jugador?')) return;
  try {
    await JugadoresAPI.delete(id);
    jugadoresCache = jugadoresCache.filter(j => (j.id_jugador || j.id) != id);
    renderJugadores(jugadoresCache);
    showToast('Jugador eliminado', 'success');
  } catch (error) {
    jugadoresCache = jugadoresCache.filter(j => (j.id_jugador || j.id) != id);
    renderJugadores(jugadoresCache);
    showToast('Jugador eliminado localmente (sin back)', 'info');
  }
}
