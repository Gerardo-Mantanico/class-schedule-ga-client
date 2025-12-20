import { api } from '../service/api.service';


const authService = {
  recoverPassword: async (email, ) => {
    const response = await api.post('auth/recover-password', { email });
    return response;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  },
};

export default authService;

 
