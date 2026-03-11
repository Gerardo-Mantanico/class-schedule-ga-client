import api from "./api.service";

const ENDPOINT_BASE = "/recargas";

export const recargaApi = {
  createRecarga: async (data) => {
    return api.post(ENDPOINT_BASE, data);
  },

  getRecargasByCuentaId: async (cuentaId) => {
    return api.get(ENDPOINT_BASE, {
      params: { cuentaId },
    });
  },
};

export default recargaApi;
