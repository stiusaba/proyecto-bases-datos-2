document.addEventListener('DOMContentLoaded', async () => {
  await cargarEquipos();
  document.getElementById('btn-nuevo-equipo').addEventListener('click', () => {
    document.getElementById('equipo-form').reset();
    document.getElementById('equipo-id').value = '';
    document.getElementById('equipo-modal-title').textContent = 'Nuevo equipo';
    openModal('equipo-modal');
  });
  document.getElementById('btn-guardar-equipo').addEventListener('click', guardarEquipo);
  document.getElementById('search-equipos').addEventListener('input', filtrarEquipos);
});

let equiposCache = [];

async function cargarEquipos() {
  try {
    equiposCache = await EquiposAPI.getAll();
  } catch (error) {
    equiposCache = [
      { id_equipo: 1, nombre: 'Equipo Demo', ciudad: 'Bogotá', estadio: 'Estadio Demo', presupuesto: 120000000 }
    ];
  }
  renderEquipos(equiposCache);
}

function renderEquipos(data) {
  const tbody = document.querySelector('#equipos-table tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center muted">No hay equipos</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(e => `
    <tr>
      <td>${e.id_equipo || e.id || ''}</td>
      <td>${e.nombre || ''}</td>
      <td>${e.ciudad || '-'}</td>
      <td>${e.estadio || '-'}</td>
      <td>${(e.presupuesto || 0).toLocaleString('es-CO')}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-secondary btn-sm" onclick="editarEquipo(${e.id_equipo || e.id})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarEquipo(${e.id_equipo || e.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filtrarEquipos(e) {
  const q = e.target.value.toLowerCase();
  const data = equiposCache.filter(eq => (eq.nombre || '').toLowerCase().includes(q));
  renderEquipos(data);
}

function editarEquipo(id) {
  const e = equiposCache.find(x => (x.id_equipo || x.id) == id);
  if (!e) return;
  document.getElementById('equipo-id').value = e.id_equipo || e.id;
  document.getElementById('equipo-nombre').value = e.nombre || '';
  document.getElementById('equipo-ciudad').value = e.ciudad || '';
  document.getElementById('equipo-estadio').value = e.estadio || '';
  document.getElementById('equipo-presupuesto').value = e.presupuesto || '';
  document.getElementById('equipo-modal-title').textContent = 'Editar equipo';
  openModal('equipo-modal');
}

async function guardarEquipo() {
  const id = document.getElementById('equipo-id').value;
  const data = {
    nombre: document.getElementById('equipo-nombre').value.trim(),
    ciudad: document.getElementById('equipo-ciudad').value.trim(),
    estadio: document.getElementById('equipo-estadio').value.trim(),
    presupuesto: parseFloat(document.getElementById('equipo-presupuesto').value) || 0
  };
  if (!data.nombre) {
    showToast('El nombre es obligatorio', 'error');
    return;
  }
  try {
    if (id) {
      await EquiposAPI.update(id, data);
      const idx = equiposCache.findIndex(e => (e.id_equipo || e.id) == id);
      if (idx >= 0) equiposCache[idx] = { ...equiposCache[idx], ...data };
      showToast('Equipo actualizado', 'success');
    } else {
      const created = await EquiposAPI.create(data);
      equiposCache.push(created);
      showToast('Equipo creado', 'success');
    }
    renderEquipos(equiposCache);
    closeModalById('equipo-modal');
  } catch (error) {
    // fallback sin back
    if (!id) {
      const fake = { ...data, id_equipo: Date.now() };
      equiposCache.push(fake);
      renderEquipos(equiposCache);
      showToast('Equipo creado localmente (sin back)', 'info');
      closeModalById('equipo-modal');
    } else {
      showToast(error.message, 'error');
    }
  }
}

async function eliminarEquipo(id) {
  if (!confirm('¿Eliminar equipo?')) return;
  try {
    await EquiposAPI.delete(id);
    equiposCache = equiposCache.filter(e => (e.id_equipo || e.id) != id);
    renderEquipos(equiposCache);
    showToast('Equipo eliminado', 'success');
  } catch (error) {
    equiposCache = equiposCache.filter(e => (e.id_equipo || e.id) != id);
    renderEquipos(equiposCache);
    showToast('Equipo eliminado localmente (sin back)', 'info');
  }
}
