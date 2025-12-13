import api from './api.service';

const BASE = '/api/inventario';

export const inventarioApi = {
  // MEDICAMENTOS
  getMedicamentoDetalle: async (id) => {
    const res = await api.get(`${BASE}/medicamentos/detalle/${id}`);
    return res;
  },
  getMedicamentosDetalle: async () => {
    const res = await api.get(`${BASE}/medicamentos/detalle`);
    return res;
  },
  createMedicamento: async (payload) => {
    const res = await api.post(`${BASE}/medicamentos`, payload);
    return res;
  },
  updateMedicamento: async (id, payload) => {
    const res = await api.put(`${BASE}/medicamentos/${id}`, payload);
    return res;
  },
  deleteMedicamento: async (id) => {
    const res = await api.delete(`${BASE}/medicamentos/${id}`);
    return res;
  },

  // CATALOGOS
  // Categorias
  getCategorias: async () => api.get(`${BASE}/catalogos/categorias`),
  getCategoria: async (id) => api.get(`${BASE}/catalogos/categorias/${id}`),
  createCategoria: async (payload) => api.post(`${BASE}/catalogos/categorias`, payload),
  updateCategoria: async (id, payload) => api.put(`${BASE}/catalogos/categorias/${id}`, payload),
  deleteCategoria: async (id) => api.delete(`${BASE}/catalogos/categorias/${id}`),

  // Unidades
  getUnidades: async () => api.get(`${BASE}/catalogos/unidades`),
  getUnidad: async (id) => api.get(`${BASE}/catalogos/unidades/${id}`),
  createUnidad: async (payload) => api.post(`${BASE}/catalogos/unidades`, payload),
  updateUnidad: async (id, payload) => api.put(`${BASE}/catalogos/unidades/${id}`, payload),
  deleteUnidad: async (id) => api.delete(`${BASE}/catalogos/unidades/${id}`),

  // Formas
  getFormas: async () => api.get(`${BASE}/catalogos/formas`),
  getForma: async (id) => api.get(`${BASE}/catalogos/formas/${id}`),
  createForma: async (payload) => api.post(`${BASE}/catalogos/formas`, payload),
  updateForma: async (id, payload) => api.put(`${BASE}/catalogos/formas/${id}`, payload),
  deleteForma: async (id) => api.delete(`${BASE}/catalogos/formas/${id}`),

  // Principios activos
  getPrincipios: async () => api.get(`${BASE}/catalogos/principios`),
  getPrincipio: async (id) => api.get(`${BASE}/catalogos/principios/${id}`),
  createPrincipio: async (payload) => api.post(`${BASE}/catalogos/principios`, payload),
  updatePrincipio: async (id, payload) => api.put(`${BASE}/catalogos/principios/${id}`, payload),
  deletePrincipio: async (id) => api.delete(`${BASE}/catalogos/principios/${id}`),

  // Otros
  getProveedores: async () => api.get(`${BASE}/catalogos/proveedores`),
  getUbicaciones: async () => api.get(`${BASE}/catalogos/ubicaciones`),
};

export default inventarioApi;
