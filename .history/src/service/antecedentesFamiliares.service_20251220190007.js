import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/infoPaciente'; 

export const InformacionPacienteApi = createCrudService(ENDPOINT_BASE);

export default InformacionPacienteApi;