import { useCrud } from '../useCrud';
import { reporteApi } from '../../service/Reporte.service';

export interface ReporteMedicamento {
  id: number;
  diferencia: number;
  medicamentoId: number;
  activo: boolean;
  nombreComercial: string;
  stockMinimo: number;
  precioVenta: number;
  stockTotal: number;
}


export const useInventario = () => {

  
  /* -------- CATEGORÍAS -------- */
  const reporteMedicamentos = useCrud<ReporteMedicamento>(reporteApi.reporteMinimo);

  return {
   reporteMedicamentos
  };
};

export default useInventario;