import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/evaluacion'; 

export const AntecedentesFamiliaresApi = createCrudService(ENDPOINT_BASE);

export default AntecedentesFamiliaresApi;