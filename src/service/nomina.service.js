import { create } from 'domain';
import { createCrudService } from './crud.factory';

const NOMINAS = '/nomina';
export const nominasApi = createCrudService(NOMINAS);

//catalogos
const NOMINAS_METODOS_PAGO = '/nomina/metodos-pago';
export const nominasMetodosPagoApi = createCrudService(NOMINAS_METODOS_PAGO);




// Retenciones should be scoped under the nomina id like the other nested endpoints
export const retencionesApi =  createCrudService("/nomina/retenciones");
export const descuentosApi =  createCrudService("/nomina/descuentos");
export const bonosApi =  createCrudService("/nomina/bonos");

export const pagarNomina = createCrudService("/nomina-pagada");


export const nominaService = {
  nomina: nominasApi,
  nominaMetodoPago: nominasMetodosPagoApi,
  retencionesApi,
  descuentosApi,
  bonosApi,
  pagarNomina,
};
