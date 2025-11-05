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
      console.error(err);
      localStorage.clear();
      window.location.href = "login.html";
    });
});

let jugadoresCache = [];
let equiposParaJugadores = [];

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([cargarEquiposParaJugadores(), cargarJugadores()]);
  
  document.getElementById('btn-nuevo-jugador').addEventListener('click', () => {
    document.getElementById('jugador-form').reset();
    document.getElementById('jugador-id').value = '';  // Reset the player ID for creating new players
    document.getElementById('jugador-modal-title').textContent = 'Nuevo jugador';
    openModal('jugador-modal');
  });

  document.getElementById('btn-guardar-jugador').addEventListener('click', guardarJugador);
  document.getElementById('search-jugadores').addEventListener('input', filtrarJugadores);
});

// Cargar equipos para jugadores
async function cargarEquiposParaJugadores() {
  try {
    equiposParaJugadores = await EquiposAPI.getAll();
  } catch (error) {
    equiposParaJugadores = [{ id_equipo: 1, nombre: 'Equipo Demo' }];
  }
  fillSelect('jugador-equipo', equiposParaJugadores, 'id_equipo', 'nombre');
}

// Cargar todos los jugadores
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

// Renderizar la tabla de jugadores
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

// Obtener nombre del equipo
function getNombreEquipo(id) {
  const e = equiposParaJugadores.find(eq => (eq.id_equipo || eq.id) == id);
  return e ? e.nombre : '-';
}

// Filtrar jugadores
function filtrarJugadores(e) {
  const q = e.target.value.toLowerCase();
  const data = jugadoresCache.filter(j => (j.nombre || '').toLowerCase().includes(q));
  renderJugadores(data);
}

// Editar jugador
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

// Guardar jugador (crear o editar)
async function guardarJugador() {
  const id = document.getElementById('jugador-id').value; // Obtén el ID del jugador (si se está editando)
  const data = {
    nombre: document.getElementById('jugador-nombre').value.trim(),
    posicion: document.getElementById('jugador-posicion').value.trim(),
    id_equipo: parseInt(document.getElementById('jugador-equipo').value), // ID del equipo
    dorsal: parseInt(document.getElementById('jugador-dorsal').value) || null,
    goles: parseInt(document.getElementById('jugador-goles').value) || 0
  };

  // Validación de los campos obligatorios
  if (!data.nombre || !data.posicion || !data.id_equipo) {
    showToast('El nombre, la posición y el equipo son obligatorios', 'error');
    return;
  }

  try {
    if (id) {
      // Si el ID está presente, es una actualización
      console.log("Actualizando jugador con ID:", id); // Verifica los datos en consola
      await JugadoresAPI.update(id, data);
      const idx = jugadoresCache.findIndex(j => (j.id_jugador || j.id) == id);
      if (idx >= 0) jugadoresCache[idx] = { ...jugadoresCache[idx], ...data };
      showToast('Jugador actualizado correctamente', 'success');
    } else {
      // Si no hay ID, es un nuevo jugador
      console.log("Creando jugador con datos:", data); // Verifica los datos antes de enviarlos
      const created = await JugadoresAPI.create(data);
      jugadoresCache.push(created); // Agrega al cache
      showToast('Jugador creado correctamente', 'success');
    }

    renderJugadores(jugadoresCache);
    closeModalById('jugador-modal'); // Cierra el modal
  } catch (error) {
    console.error('❌ Error al guardar jugador:', error);
    showToast(error.message || 'Error al guardar el jugador', 'error');
  }
}



// Eliminar jugador
async function eliminarJugador(id) {
  if (!confirm('¿Eliminar jugador?')) return;
  try {
    await JugadoresAPI.delete(id);
    jugadoresCache = jugadoresCache.filter(j => (j.id_jugador || j.id) != id);
    renderJugadores(jugadoresCache);
    showToast('Jugador eliminado correctamente', 'success');
  } catch (error) {
    console.error('❌ Error al eliminar jugador:', error);
    showToast(error.message || 'No se pudo eliminar el jugador', 'error');
  }
}
