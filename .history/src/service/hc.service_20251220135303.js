import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/citas'; 

export const citaApi = createCrudService(ENDPOINT_BASE);

export default citaApi;