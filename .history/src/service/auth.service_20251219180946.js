
import { api } from '../service/api.service';


const authService = {
  recoverPassword: async (email, ) => {
    const response = await api.post('auth/recover-password', { email });
    return response;
  },

  verifyCode: async ( email,code) => {
    const response = await api.post('auth/verify-code', { email, code });
    return response;
  },

  getProfile: async () => {
    const response = await api.get('auth/change-password');
    return response;
  },
};

export default authService;

 
