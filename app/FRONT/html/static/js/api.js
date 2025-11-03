const API_BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://localhost:5000/api';

async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const opts = {
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    ...options
  };
  const res = await fetch(url, opts);
  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = { message: res.statusText }; }
    throw new Error(err.message || 'Error en la petición');
  }
  return res.json();
}

const AuthAPI = {
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgot: (data) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) })
};

const EquiposAPI = {
  getAll: () => apiRequest('/equipos'),
  create: (data) => apiRequest('/equipos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/equipos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/equipos/${id}`, { method: 'DELETE' })
};

const JugadoresAPI = {
  getAll: () => apiRequest('/jugadores'),
  create: (data) => apiRequest('/jugadores', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/jugadores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/jugadores/${id}`, { method: 'DELETE' })
};

const PartidosAPI = {
  getAll: () => apiRequest('/partidos'),
  create: (data) => apiRequest('/partidos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/partidos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/partidos/${id}`, { method: 'DELETE' })
};

const TransferenciasAPI = {
  getAll: () => apiRequest('/transferencias'),
  create: (data) => apiRequest('/transferencias', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/transferencias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/transferencias/${id}`, { method: 'DELETE' })
};

const NoticiasAPI = {
  getAll: (query = '') => apiRequest(`/noticias${query}`),
  create: (data) => apiRequest('/noticias', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/noticias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/noticias/${id}`, { method: 'DELETE' })
};

const TemporadasAPI = {
  getAll: () => apiRequest('/temporadas')
};

const ReportesAPI = {
  tablaPosiciones: (idTemporada) => apiRequest(`/reportes/tabla-posiciones/${idTemporada}`),
  topGoleadores: () => apiRequest('/reportes/top-goleadores'),
  partidosRecientes: () => apiRequest('/reportes/partidos-recientes'),
  dashboardStats: () => apiRequest('/reportes/dashboard')
};

