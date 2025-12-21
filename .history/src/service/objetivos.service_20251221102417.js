import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/objetivos'; 

export const ObjetivosApi = createCrudService(ENDPOINT_BASE);

export default ObjetivosApi;