import { createCrudService } from './crud.factory';

const REPORTE_INVENTARIO_PROXIMO_MINIMO = '/reporte/reportes/inventario/proximo-minimo'; 
export const reporteMinimo = createCrudService(REPORTE_INVENTARIO_PROXIMO_MINIMO);

const REPORTE_HISTORIAL = '/reporte/HISTORIAL'; 
export const reporteHistorial = createCrudService(REPORTE_HISTORIAL);



export const reporteApi = {
    reporteMinimo,
    reporteHistorial,
};

export default reporteApi; 