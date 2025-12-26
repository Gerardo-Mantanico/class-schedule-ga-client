import { useCrud } from '../useCrud';
import { sesionesAreaServicioApi } from '../../service/Reportes.service';

export interface ReporteSesion {
  id: number;
  areaId: number;
  areaNombre: string;
  servicioId: number;
  servicioNombre: string;
  sesiones: number;
}

export const useReporteSesiones = () => {
  const {
    items: reportes,
    loading,
    error,
   
  } = useCrud<ReporteSesion>(sesionesAreaServicioApi);

  return {
    reportes,
    loading,
    error
  };
};