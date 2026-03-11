import api from "./api.service";

const ENDPOINT_BASE = "/cuentas-digitales";

export const cuentaDigitalApi = {
  getMiCuentaDigital: async () => {
    const response = await api.get(ENDPOINT_BASE);
    return response;
  },
};

export default cuentaDigitalApi;
