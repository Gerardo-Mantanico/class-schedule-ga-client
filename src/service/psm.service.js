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
  }
};

export default psmApi;