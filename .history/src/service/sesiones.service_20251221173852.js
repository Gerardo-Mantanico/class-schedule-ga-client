import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/sesioness'; 

export const SesionesApi = createCrudService(ENDPOINT_BASE);

export default SesionesApi;