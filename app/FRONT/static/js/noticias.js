let noticiasActuales = [];
let vistaActual = 'grid';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarNoticias();
  document.getElementById('btn-crear-noticia').addEventListener('click', () => abrirModalNoticia());
  document.getElementById('btn-guardar-noticia').addEventListener('click', guardarNoticia);
  document.getElementById('btn-limpiar-filtros').addEventListener('click', limpiarFiltros);

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      vistaActual = btn.dataset.view;
      renderNoticias();
    });
  });

  const search = document.getElementById('search-noticias');
  search.addEventListener('input', () => renderNoticias());
  document.getElementById('filter-tag').addEventListener('change', renderNoticias);
  document.getElementById('sort-by').addEventListener('change', renderNoticias);
});

async function cargarNoticias() {
  try {
    // GET a /noticias (cuando exista)
    const news = await NoticiasAPI.getAll('');
    noticiasActuales = Array.isArray(news) ? news : [];
  } catch (error) {
    // mientras no haya backend, metemos de ejemplo
    noticiasActuales = [
      { _id: '1', titulo: 'Inicio de la temporada', contenido: 'La temporada 2025 inicia con 10 equipos...', autor: 'Admin', fecha: new Date().toISOString(), tag: 'General' },
      { _id: '2', titulo: 'Fichaje estrella', contenido: 'Se confirma el fichaje del delantero...', autor: 'Prensa', fecha: new Date().toISOString(), tag: 'Fichajes' }
    ];
  }
  renderNoticias();
}

function renderNoticias() {
  const cont = document.getElementById('news-container');
  const search = (document.getElementById('search-noticias').value || '').toLowerCase();
  const tag = document.getElementById('filter-tag').value;
  const sort = document.getElementById('sort-by').value;

  let data = noticiasActuales.filter(n => {
    const okSearch = !search || (n.titulo && n.titulo.toLowerCase().includes(search)) || (n.contenido && n.contenido.toLowerCase().includes(search));
    const okTag = !tag || n.tag === tag;
    return okSearch && okTag;
  });

  if (sort === 'fecha_desc') data.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
  if (sort === 'fecha_asc') data.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
  if (sort === 'titulo') data.sort((a,b) => (a.titulo || '').localeCompare(b.titulo || ''));

  if (data.length === 0) {
    cont.innerHTML = '<div class="muted center-full">No hay noticias</div>';
    return;
  }

  cont.className = vistaActual === 'grid' ? 'news-grid' : 'news-list';
  cont.innerHTML = data.map(n => `
    <article class="news-card" data-id="${n._id || n.id}">
      <div class="news-image">
        ${n.imagen ? `<img src="${n.imagen}" alt="${n.titulo}">` : ''}
      </div>
      <div class="news-content">
        <div class="news-header">
          <h3 class="news-title">${n.titulo || ''}</h3>
        </div>
        <div class="news-meta">
          <span>${formatFechaNoticia(n.fecha)}</span>
          <span>${n.autor || 'Administrador'}</span>
        </div>
        <p class="news-excerpt">${(n.contenido || '').slice(0,140)}...</p>
        <div class="news-tags">
          <span class="news-tag">${n.tag || 'General'}</span>
        </div>
        <div class="news-footer">
          <span class="news-author">${n.autor || 'Admin'}</span>
          <div class="news-actions">
            <button class="btn btn-secondary btn-sm" onclick="editarNoticia('${n._id || n.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarNoticia('${n._id || n.id}')">🗑️</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function abrirModalNoticia(noticia = null) {
  document.getElementById('noticia-form').reset();
  document.getElementById('noticia-id').value = noticia ? (noticia._id || noticia.id) : '';
  document.getElementById('titulo').value = noticia ? noticia.titulo : '';
  document.getElementById('contenido').value = noticia ? noticia.contenido : '';
  document.getElementById('autor').value = noticia ? noticia.autor : '';
  document.getElementById('tag').value = noticia ? (noticia.tag || 'General') : 'General';
  document.getElementById('imagen').value = noticia ? (noticia.imagen || '') : '';
  document.getElementById('modal-title').textContent = noticia ? 'Editar noticia' : 'Nueva noticia';
  openModal('noticia-modal');
}

function editarNoticia(id) {
  const noticia = noticiasActuales.find(n => (n._id || n.id) == id);
  if (!noticia) return;
  abrirModalNoticia(noticia);
}

async function guardarNoticia() {
  const id = document.getElementById('noticia-id').value;
  const data = {
    titulo: document.getElementById('titulo').value.trim(),
    contenido: document.getElementById('contenido').value.trim(),
    autor: document.getElementById('autor').value.trim() || 'Administrador',
    tag: document.getElementById('tag').value,
    imagen: document.getElementById('imagen').value.trim()
  };

  if (!data.titulo || !data.contenido) {
    showToast('Título y contenido son obligatorios', 'error');
    return;
  }

  try {
    if (id) {
      await NoticiasAPI.update(id, data);
      const idx = noticiasActuales.findIndex(n => (n._id || n.id) == id);
      if (idx >= 0) noticiasActuales[idx] = { ...noticiasActuales[idx], ...data };
      showToast('Noticia actualizada', 'success');
    } else {
      const created = await NoticiasAPI.create(data);
      noticiasActuales.unshift(created);
      showToast('Noticia creada', 'success');
    }
    renderNoticias();
    closeModalById('noticia-modal');
  } catch (error) {
    // si el back no está, actualizamos local nomás
    if (!id) {
      const fakeId = 'fake-' + Date.now();
      noticiasActuales.unshift({ ...data, _id: fakeId, fecha: new Date().toISOString() });
      renderNoticias();
      showToast('Noticia guardada localmente (sin back)', 'info');
      closeModalById('noticia-modal');
    } else {
      showToast(error.message, 'error');
    }
  }
}

async function eliminarNoticia(id) {
  if (!confirm('¿Eliminar la noticia?')) return;
  try {
    await NoticiasAPI.delete(id);
    noticiasActuales = noticiasActuales.filter(n => (n._id || n.id) != id);
    renderNoticias();
    showToast('Noticia eliminada', 'success');
  } catch (error) {
    // fallback sin back
    noticiasActuales = noticiasActuales.filter(n => (n._id || n.id) != id);
    renderNoticias();
    showToast('Noticia eliminada localmente (sin back)', 'info');
  }
}

function limpiarFiltros() {
  document.getElementById('filter-tag').value = '';
  document.getElementById('sort-by').value = 'fecha_desc';
  document.getElementById('search-noticias').value = '';
  renderNoticias();
}

function formatFechaNoticia(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}
