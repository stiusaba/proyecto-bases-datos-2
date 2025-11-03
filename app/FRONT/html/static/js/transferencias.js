let transferCache = [];
let jugadoresT = [];
let equiposT = [];

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([cargarDataTransfer(), cargarTransferencias()]);
  document.getElementById('btn-nueva-transferencia').addEventListener('click', () => {
    document.getElementById('transfer-form').reset();
    document.getElementById('transfer-id').value = '';
    document.getElementById('transfer-modal-title').textContent = 'Registrar transferencia';
    openModal('transfer-modal');
  });
  document.getElementById('btn-guardar-transferencia').addEventListener('click', guardarTransferencia);
});

async function cargarDataTransfer() {
  try {
    jugadoresT = await JugadoresAPI.getAll();
  } catch (error) {
    jugadoresT = [{ id_jugador: 1, nombre: 'Jugador Demo' }];
  }
  try {
    equiposT = await EquiposAPI.getAll();
  } catch (error) {
    equiposT = [{ id_equipo: 1, nombre: 'Equipo Demo' }];
  }
  fillSelect('transfer-jugador', jugadoresT, 'id_jugador', 'nombre');
  fillSelect('transfer-desde', equiposT, 'id_equipo', 'nombre');
  fillSelect('transfer-hacia', equiposT, 'id_equipo', 'nombre');
}

async function cargarTransferencias() {
  try {
    transferCache = await TransferenciasAPI.getAll();
  } catch (error) {
    transferCache = [
      { id_transferencia: 1, id_jugador: 1, desde: 1, hacia: 1, monto: 1000000, fecha: new Date().toISOString(), estado: 'PENDIENTE' }
    ];
  }
  renderTransferencias(transferCache);
}

function renderTransferencias(data) {
  const tbody = document.querySelector('#transfer-table tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center muted">No hay transferencias</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(t => `
    <tr>
      <td>${t.id_transferencia || t.id || ''}</td>
      <td>${getNombreJugador(t.id_jugador)}</td>
      <td>${getNombreEquipo(t.desde)}</td>
      <td>${getNombreEquipo(t.hacia)}</td>
      <td>${(t.monto || 0).toLocaleString('es-CO')}</td>
      <td>${formatDate(t.fecha)}</td>
      <td><span class="badge badge-info">${t.estado || 'PENDIENTE'}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editarTransferencia(${t.id_transferencia || t.id})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarTransferencia(${t.id_transferencia || t.id})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function getNombreJugador(id) {
  const j = jugadoresT.find(x => (x.id_jugador || x.id) == id);
  return j ? j.nombre : '-';
}
function getNombreEquipo(id) {
  const e = equiposT.find(x => (x.id_equipo || x.id) == id);
  return e ? e.nombre : '-';
}

function editarTransferencia(id) {
  const t = transferCache.find(x => (x.id_transferencia || x.id) == id);
  if (!t) return;
  document.getElementById('transfer-id').value = t.id_transferencia || t.id;
  document.getElementById('transfer-jugador').value = t.id_jugador || '';
  document.getElementById('transfer-desde').value = t.desde || '';
  document.getElementById('transfer-hacia').value = t.hacia || '';
  document.getElementById('transfer-monto').value = t.monto || '';
  document.getElementById('transfer-fecha').value = t.fecha ? t.fecha.slice(0,10) : '';
  document.getElementById('transfer-modal-title').textContent = 'Editar transferencia';
  openModal('transfer-modal');
}

async function guardarTransferencia() {
  const id = document.getElementById('transfer-id').value;
  const data = {
    id_jugador: parseInt(document.getElementById('transfer-jugador').value),
    desde: parseInt(document.getElementById('transfer-desde').value),
    hacia: parseInt(document.getElementById('transfer-hacia').value),
    monto: parseFloat(document.getElementById('transfer-monto').value) || 0,
    fecha: document.getElementById('transfer-fecha').value || new Date().toISOString(),
    estado: 'PENDIENTE'
  };
  if (!data.id_jugador || !data.desde || !data.hacia) {
    showToast('Jugador y equipos son obligatorios', 'error');
    return;
  }
  try {
    if (id) {
      await TransferenciasAPI.update(id, data);
      const idx = transferCache.findIndex(t => (t.id_transferencia || t.id) == id);
      if (idx >= 0) transferCache[idx] = { ...transferCache[idx], ...data };
      showToast('Transferencia actualizada', 'success');
    } else {
      const created = await TransferenciasAPI.create(data);
      transferCache.push(created);
      showToast('Transferencia creada', 'success');
    }
    renderTransferencias(transferCache);
    closeModalById('transfer-modal');
  } catch (error) {
    if (!id) {
      transferCache.push({ ...data, id_transferencia: Date.now() });
      renderTransferencias(transferCache);
      showToast('Transferencia creada localmente (sin back)', 'info');
      closeModalById('transfer-modal');
    } else {
      showToast(error.message, 'error');
    }
  }
}

async function eliminarTransferencia(id) {
  if (!confirm('¿Eliminar transferencia?')) return;
  try {
    await TransferenciasAPI.delete(id);
    transferCache = transferCache.filter(t => (t.id_transferencia || t.id) != id);
    renderTransferencias(transferCache);
    showToast('Transferencia eliminada', 'success');
  } catch (error) {
    transferCache = transferCache.filter(t => (t.id_transferencia || t.id) != id);
    renderTransferencias(transferCache);
    showToast('Transferencia eliminada localmente (sin back)', 'info');
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('es-CO');
}
