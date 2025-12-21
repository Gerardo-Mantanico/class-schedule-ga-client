import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/hc/historia-personal'; 

export const HistoriaPersonalApi = createCrudService(ENDPOINT_BASE);

export default HistoriaPersonalApi;