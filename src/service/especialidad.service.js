import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/especialidad'; 

export const especialidadApi = createCrudService(ENDPOINT_BASE);

export default especialidadApi;