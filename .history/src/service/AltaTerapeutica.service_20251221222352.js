import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/alta-medica'; 

export const AltaTerapeuticaApi = createCrudService(ENDPOINT_BASE);

export default AltaTerapeuticaApi;