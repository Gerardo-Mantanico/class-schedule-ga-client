import { createCrudService } from './crud.factory';

const ENDPOINT = '/formas';
export const formasApi = createCrudService(ENDPOINT);

export default formasApi;
