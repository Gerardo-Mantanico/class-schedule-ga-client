import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/citas'; 

export const hcApi = createCrudService(ENDPOINT_BASE);

export default hcApi;