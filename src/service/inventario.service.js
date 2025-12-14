import { createCrudService } from './crud.factory';


const ENDPOINT_BASE = '/medicamentos';
export const medicamentosApi = createCrudService(ENDPOINT_BASE);

const CATEGORIA = '/categorias';
export const categoriasApi = createCrudService(CATEGORIA);

const UNIDAD = '/unidades';
export const unidadesApi = createCrudService(UNIDAD);

const FORMA = '/formas';
export const formasApi = createCrudService(FORMA);

const PRINCIPIO = '/principios';
export const principiosApi = createCrudService(PRINCIPIO);

const PROVEEDORES = '/proveedores';
export const proveedoresApi = createCrudService(PROVEEDORES);

const UBICACIONES = '/ubicaciones';
export const ubicacionesApi = createCrudService(UBICACIONES);


export const inventarioApi = {
  medicamentos: medicamentosApi,
  categorias: categoriasApi,
  unidades: unidadesApi,
  formas: formasApi,
  principios: principiosApi,
  proveedores: proveedoresApi,
  ubicaciones: ubicacionesApi,
};

export default inventarioApi; 