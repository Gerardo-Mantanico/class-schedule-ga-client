import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/reporte/sesiones-area-servicio'; 

export const sesionesAreaServicioApi = createCrudService(ENDPOINT_BASE);

export default

sesionesAreaServicioApi;