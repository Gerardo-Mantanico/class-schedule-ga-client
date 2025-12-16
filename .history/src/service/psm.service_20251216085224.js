import { createCrudService } from './crud.factory';
import api from './api.service';

const ENDPOINT_BASE = '/psm'; 

export const psmApi = {
  ...createCrudService(ENDPOINT_BASE),
  
  getCurrentUser: async () => {
    const response = await api.get(`${ENDPOINT_BASE}/me`);
    return response;
  },

  createCurrentProfile: async (data) => {
    const response = await api.post(`${ENDPOINT_BASE}`, data);
    return response;
  },

  updateCurrentProfile: async (data) => {
    const response = await api.put(`${ENDPOINT_BASE}`, data);
    return response;
  },

  // Obtener PSM por ID de usuario
  getByUserId: async (userId) => {
    const response = await api.get(`${ENDPOINT_BASE}/${userId}`);
    return response;
  },

  // Crear PSM para un usuario específico
  createForUser: async (userId, data) => {
    const response = await api.post(`${ENDPOINT_BASE}/${userId}`, data);
    return response;
  },

  // Actualizar PSM de un usuario específico
  updateForUser: async (userId, data) => {
    const response = await api.put(`${ENDPOINT_BASE}/${userId}`, data);
    return response;
  },

  // Eliminar PSM de un usuario específico
  deleteForUser: async (userId) => {
    const response = await api.delete(`${ENDPOINT_BASE}/${userId}`);
    return response;
  }
};

export default psmApi;