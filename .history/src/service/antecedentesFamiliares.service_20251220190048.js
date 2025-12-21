import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/hc/antecedentes-familiares'; 

export const InformacionPacienteApi = createCrudService(ENDPOINT_BASE);

export default InformacionPacienteApi;