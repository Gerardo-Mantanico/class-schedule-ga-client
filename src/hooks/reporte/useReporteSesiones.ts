import { useCrud } from '../useCrud';
import { sesionesCongresoServicioApi } from '../../service/Reportes.service';

export interface ReporteSesion {
  id: number;
  congresoId: number;
  congresoNombre: string;
  servicioId: number;
  servicioNombre: string;
  sesiones: number;
}

export const useReporteSesiones = () => {
  const {
    items: reportes,
    loading,
    error,
   
  } = useCrud<ReporteSesion>(sesionesCongresoServicioApi);

  return {
    reportes,
    loading,
    error
  };
};