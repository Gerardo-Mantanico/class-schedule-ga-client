import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/hc/estado-actual'; 

export const EstadoActualApi = createCrudService(ENDPOINT_BASE);

export default EstadoActualApi;