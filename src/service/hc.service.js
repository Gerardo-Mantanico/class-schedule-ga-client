import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/hc/encabezado'; 

export const hcApi = createCrudService(ENDPOINT_BASE);

export default hcApi;