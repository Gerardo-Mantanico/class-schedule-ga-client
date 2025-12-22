import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/hc/antecedentes-familiares'; 

export const AntecedentesFamiliaresApi = createCrudService(ENDPOINT_BASE);

export default AntecedentesFamiliaresApi;