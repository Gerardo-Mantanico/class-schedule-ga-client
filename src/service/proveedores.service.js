import { createCrudService } from './crud.factory';

const ENDPOINT = '/proveedores';
export const proveedoresApi = createCrudService(ENDPOINT);

export default proveedoresApi;
