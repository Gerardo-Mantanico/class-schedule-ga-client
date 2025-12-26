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
  id:number;
  nominaId: number;
  tipoId: number;
  monto: number;
}

export interface NominaReporte {
  id: number;
  nominaId: number;
  userId: number;
  codigoFactura: string;
  dataJson: DataJsonNomina; // Puedes usar DataJsonNomina si lo parseas
  fechaPago: string | null;
  pagado: boolean;
  createdAt: string;
  email: string;
}


export interface DataJsonNomina {
  id: number;
  user: {
    id: number;
    email: string;
    lastname: string;
    firstname: string;
    phoneNumber?: string;
  };
  bonos: {
    id: number;
    monto: number;
    tipoId: number;
    tipoDescripcion: string;
  }[];
  periodo: string;
  descuentos: {
    id: number;
    monto: number;
    tipoId: number;
    tipoDescripcion: string;
  }[];
  metodoPago: string;
  detallePago: string;
  fechaCierre: string;
  retenciones: {
    id: number;
    monto: number;
    tipoId: number;
    tipoDescripcion: string;
  }[];
  salarioBase: number;
  salarioBruto: number;
  sesionesTrabajadas: number;
  salarioNetoAdeudado: number;
}


 
export const useNomina = () => {

   const nominas = useCrud<NominaDetail>(nominaService.nomina);
   const tipoPago = useCrud<CatalogItem>(nominaService.nominaMetodoPago);

  //conceptos de nomina
  const  retenciones = useCrud<conceptosNomina>(nominaService.retencionesApi);
  const  bonos = useCrud<conceptosNomina>(nominaService.bonosApi);
  const  descuentos = useCrud<conceptosNomina>(nominaService.descuentosApi);
  const  pagarNomina = useCrud<NominaReporte>(nominaService.pagarNomina);



  return {
    nominas,
    retenciones,
    bonos,
    descuentos,
    tipoPago,
    pagarNomina
  };
};

export default useNomina;

