import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/users'; 

export const userApi = createCrudService(ENDPOINT_BASE);

export default userApi;