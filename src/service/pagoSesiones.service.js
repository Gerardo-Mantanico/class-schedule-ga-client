import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/pago-sesiones'; 

export const PagoSesionesApi = createCrudService(ENDPOINT_BASE);

export default PagoSesionesApi;