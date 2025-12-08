import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/areas'; 

export const areaApi = createCrudService(ENDPOINT_BASE);

export default areaApi;