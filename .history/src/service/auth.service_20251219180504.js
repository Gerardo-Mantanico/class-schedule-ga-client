import { verify } from 'crypto';
import { api } from '../service/api.service';


const authService = {
  recoverPassword: async (email, ) => {
    const response = await api.post('auth/recover-password', { email });
    return response;
  },

  verifycode: async ( email,code) => {
    const response = await api.post('auth/verify-code', { email, code });
    return response;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  },
};

export default authService;

 
