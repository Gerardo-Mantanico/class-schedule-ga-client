import { nominaService } from '@/service/nomina.service';
import { useCrud } from './useCrud';


export interface Nomina {
  id: number;
  userId: number;
  periodo: string;
  salarioBase: number;
  metodoPago: number;
  detallePago: string;
  fechaCierre: string;
}

export interface NominaUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
}

export interface NestedItem {
  id: number;
  tipoId: number;
  tipoDescripcion?: string;
  monto: number;
}

// extend Nomina with read-only fields returned by GET
export interface NominaDetail extends Nomina {
  user?: NominaUser;
  sesionesTrabajadas?: number;
  salarioBruto?: number;
  salarioNetoAdeudado?: number;
  bonos?: NestedItem[];
  retenciones?: NestedItem[];
  descuentos?: NestedItem[];
}

export interface CatalogItem {
  id: number;
  descripcion: string;
}

export interface conceptosNomina {
  nominaId: number;
  tipoId: number;
  monto: number;
}
 
export const useNomina = () => {

   const nominas = useCrud<NominaDetail>(nominaService.nomina);
   const tipoPago = useCrud<CatalogItem>(nominaService.nominaMetodoPago);

  // Catálogos de tipos (para los selects)
  const retencionesTipos = useCrud<CatalogItem>(nominaService.retencionesTiposApi);
  const bonosTipos = useCrud<CatalogItem>(nominaService.bonosTiposApi);
  const descuentosTipos = useCrud<CatalogItem>(nominaService.descuentosTiposApi);

  // Conceptos de nómina (para crear/eliminar)
  const retenciones = useCrud<conceptosNomina>(nominaService.retencionesApi);
  const bonos = useCrud<conceptosNomina>(nominaService.bonosApi);
  const descuentos = useCrud<conceptosNomina>(nominaService.descuentosApi);

  return {
    nominas,
    retenciones,
    bonos,
    descuentos,
    retencionesTipos,
    bonosTipos,
    descuentosTipos,
    tipoPago
  };
};

export default useNomina;

