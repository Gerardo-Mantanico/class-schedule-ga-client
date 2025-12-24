import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/escala-pruebas'; 

export const EscalasPruebasApi = createCrudService(ENDPOINT_BASE);

export default EscalasPruebasApi;