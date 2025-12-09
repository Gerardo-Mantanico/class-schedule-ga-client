import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/roles'; 

export const roleApi = createCrudService(ENDPOINT_BASE);

export default roleApi;