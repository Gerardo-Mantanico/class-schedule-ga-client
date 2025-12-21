import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/evaluacion'; 

export const EvaluacionPeriodicaApi = createCrudService(ENDPOINT_BASE);

export default EvaluacionPeriodicaApi;