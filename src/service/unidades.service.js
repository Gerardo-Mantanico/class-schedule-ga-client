import { createCrudService } from './crud.factory';

const ENDPOINT = '/unidades';
export const unidadesApi = createCrudService(ENDPOINT);

export default unidadesApi;
