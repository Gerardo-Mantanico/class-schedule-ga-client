import { createCrudService } from './crud.factory';

const ENDPOINT = '/ubicaciones';
export const ubicacionesApi = createCrudService(ENDPOINT);

export default ubicacionesApi;
