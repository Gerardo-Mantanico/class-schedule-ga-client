import { createCrudService } from './crud.factory';

const ENDPOINT_BASE = '/imprecion-diagnostico'; 

export const ImpresionDiagnosticoApi = createCrudService(ENDPOINT_BASE);
export const C11Api = createCrudService('/imprecion-diagnostico/c11');
export const D5Api = createCrudService('/imprecion-diagnostico/dm5');

