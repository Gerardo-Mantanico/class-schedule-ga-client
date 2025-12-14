import { createCrudService } from './crud.factory';

const ENDPOINT = '/categorias';
export const categoriasApi = createCrudService(ENDPOINT);

export default categoriasApi;
