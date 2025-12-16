import { createCrudService } from './crud.factory';

const NOMINAS = '/nomina';
export const nominasApi = createCrudService(NOMINAS);

//catalogos
const NOMINAS_METODOS_PAGO = '/nomina/metodos-pago';
export const nominasMetodosPagoApi = createCrudService(NOMINAS_METODOS_PAGO);

// Catálogos de tipos
export const retencionesTiposApi = createCrudService("/nomina/retenciones/tipos");
export const bonosTiposApi = createCrudService("/nomina/bonos/tipos");
export const descuentosTiposApi = createCrudService("/nomina/descuentos/tipos");

// Conceptos de nómina (asociados a una nómina específica)
export const retencionesApi =  createCrudService("/nomina/retenciones");
export const descuentosApi =  createCrudService("/nomina/descuentos");
export const bonosApi =  createCrudService("/nomina/bonos");



export const nominaService = {
  nomina: nominasApi,
  nominaMetodoPago: nominasMetodosPagoApi,
  retencionesApi,
  retencionesTiposApi,
  bonosTiposApi,
  descuentosTiposApi,
  descuentosApi,
  bonosApi,
};
