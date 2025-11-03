let partidosCache = [];
let equiposPartidos = [];

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([cargarEquiposPartidos(), cargarPartidos()]);
  document.getElementById('btn-nuevo-partido').addEventListener('click', () => {
    document.getElementById('partido-form').reset();
    document.getElementById('partido-id').value = '';
    document.getElementById('partido-modal-title').textContent = 'Programar Partido';
    openModal('partido-modal');
  });
  document.getElementById('btn-guardar-partido').addEventListener('click', guardarPartido);
});

async function cargarEquiposPartidos() {
  try {
    equiposPartidos = await EquiposAPI.getAll();
  } catch (error) {
    equiposPartidos = [{ id_equipo: 1, nombre: 'Equipo Demo' }];
  }
  fillSelect('equipo_local', equiposPartidos, 'id_equipo', 'nombre');
  fillSelect('equipo_visitante', equiposPartidos, 'id_equipo', 'nombre');
}

async function cargarPartidos() {
  try {
    partidosCache = await PartidosAPI.getAll();
  } catch (error) {
    partidosCache = [
      { id_partido: 1, fecha_hora: new Date().toISOString(), jornada: 1, id_equipo_local: 1, id_equipo_visitante: 1, goles_local: 0, goles_visitante: 0, estado: 'PROGRAMADO' }
    ];
  }
  renderPartidos(partidosCache);
}

function renderPartidos(data) {
  const tbody = document.querySelector('#partidos-table tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center muted">No hay partidos</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(p => `
    <tr>
      <td>${p.id_partido || p.id || ''}</td>
      <td>${formatDate(p.fecha_hora)}</td>
      <td>${p.jornada || '-'}</td>
      <td>${getNombreEquipoP(p.id_equipo_local)}</td>
      <td>${getNombreEquipoP(p.id_equipo_visitante)}</td>
      <td>${(p.goles_local ?? 0)} - ${(p.goles_visitante ?? 0)}</td>
      <td><span class="badge badge-${getStatusClass(p.estado)}">${p.estado}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editarPartido(${p.id_partido || p.id})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarPartido(${p.id_partido || p.id})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function getNombreEquipoP(id) {
  const e = equiposPartidos.find(eq => (eq.id_equipo || eq.id) == id);
  return e ? e.nombre : '-';
}

function editarPartido(id) {
  const p = partidosCache.find(x => (x.id_partido || x.id) == id);
  if (!p) return;
  document.getElementById('partido-id').value = p.id_partido || p.id;
  document.getElementById('fecha_hora').value = p.fecha_hora ? p.fecha_hora.slice(0,16) : '';
  document.getElementById('jornada').value = p.jornada || '';
  document.getElementById('equipo_local').value = p.id_equipo_local || '';
  document.getElementById('equipo_visitante').value = p.id_equipo_visitante || '';
  document.getElementById('estado').value = p.estado || 'PROGRAMADO';
  document.getElementById('partido-modal-title').textContent = 'Editar Partido';
  openModal('partido-modal');
}

async function guardarPartido() {
  const id = document.getElementById('partido-id').value;
  const data = {
    fecha_hora: document.getElementById('fecha_hora').value,
    jornada: parseInt(document.getElementById('jornada').value),
    id_equipo_local: parseInt(document.getElementById('equipo_local').value),
    id_equipo_visitante: parseInt(document.getElementById('equipo_visitante').value),
    estado: document.getElementById('estado').value
  };
  if (!data.fecha_hora) {
    showToast('La fecha es obligatoria', 'error');
    return;
  }
  try {
    if (id) {
      await PartidosAPI.update(id, data);
      const idx = partidosCache.findIndex(p => (p.id_partido || p.id) == id);
      if (idx >= 0) partidosCache[idx] = { ...partidosCache[idx], ...data };
      showToast('Partido actualizado', 'success');
    } else {
      const created = await PartidosAPI.create(data);
      partidosCache.push(created);
      showToast('Partido creado', 'success');
    }
    renderPartidos(partidosCache);
    closeModalById('partido-modal');
  } catch (error) {
    // sin back
    if (!id) {
      partidosCache.push({ ...data, id_partido: Date.now() });
      renderPartidos(partidosCache);
      closeModalById('partido-modal');
      showToast('Partido creado localmente (sin back)', 'info');
    } else {
      showToast(error.message, 'error');
    }
  }
}

async function eliminarPartido(id) {
  if (!confirm('¿Eliminar este partido?')) return;
  try {
    await PartidosAPI.delete(id);
    partidosCache = partidosCache.filter(p => (p.id_partido || p.id) != id);
    renderPartidos(partidosCache);
    showToast('Partido eliminado', 'success');
  } catch (error) {
    partidosCache = partidosCache.filter(p => (p.id_partido || p.id) != id);
    renderPartidos(partidosCache);
    showToast('Partido eliminado localmente (sin back)', 'info');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getStatusClass(estado) {
  return { 'PROGRAMADO': 'info', 'JUGADO': 'success', 'SUSPENDIDO': 'error' }[estado] || 'info';
}
