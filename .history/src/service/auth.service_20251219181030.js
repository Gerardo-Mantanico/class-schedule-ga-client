
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

  changePassword: async (code, email, newPassword) => {
    const response = await api.post('auth/change-password', { code, email, newPassword });
    return response;
  },
};

export default authService;

 
