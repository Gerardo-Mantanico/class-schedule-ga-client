import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/sesiones'; 

export const SesionesApi = createCrudService(ENDPOINT_BASE);

export default SesionesApi;