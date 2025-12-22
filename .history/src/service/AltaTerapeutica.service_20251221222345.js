import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/alta-medica'; 

export const AntecedentesFamiliaresApi = createCrudService(ENDPOINT_BASE);

export default AntecedentesFamiliaresApi;