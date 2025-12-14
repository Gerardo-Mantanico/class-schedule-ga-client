import { createCrudService } from './crud.factory';

const ENDPOINT = '/principios';
export const principiosApi = createCrudService(ENDPOINT);

export default principiosApi;
