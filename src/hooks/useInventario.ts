import { inventarioApi } from '@/service/inventario.service';
import { useCrud } from './useCrud';

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Unidades {
  id: number;
  nombre: string;
  simbolo: string;
}



export interface UnidadMedida {
  id: number;
  nombre: string;
  simbolo: string;
}

export interface PrincipioActivo {
  id: number;
  nombre: string;
  concentracion: number;
  unidadMedida: UnidadMedida;
}

export interface FormaFarmaceutica {
  id: number;
  nombre: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Medicamento {
  id: number;
  nombreComercial: string;
  formaFarmaceutica: FormaFarmaceutica;
  categoria: Categoria;
  unidadesPorEmpaque: number;
  stockMinimo: number;
  precioVenta: number;
  activo: boolean;
  principiosActivos: PrincipioActivo[];
}

export interface Lote {
  id: number;
  medicamentoId: number;
  proveedorId: number;
  ubicacionId: number;
  numeroLote: string;
  fechaVencimiento: string;
  cantidad: number;
  precioCompra: number;
}



export const useInventario = () => {

  
  /* -------- CATEGORÍAS -------- */
  const categorias = useCrud<Categoria>(inventarioApi.categorias);

  /* -------- UNIDADES -------- */
  const unidades = useCrud<Unidades>(inventarioApi.unidades);

  /* -------- FORMAS -------- */
  const formas = useCrud<Categoria>(inventarioApi.formas);

  /* -------- PRINCIPIOS ACTIVOS -------- */
  const principios = useCrud<Categoria>(inventarioApi.principios);

  /* -------- PROVEEDORES -------- */
  const proveedores = useCrud<Categoria>(inventarioApi.proveedores);

  /* -------- UBICACIONES -------- */
  const ubicaciones = useCrud<Categoria>(inventarioApi.ubicaciones);

  const medicamentos = useCrud<Medicamento>(inventarioApi.medicamentos);
  /* -------- LOTES -------- */
  const lotes = useCrud<Lote>(inventarioApi.lotes);

  return {
    categorias,
    unidades,
    formas,
    principios,
    proveedores,
    ubicaciones,
    medicamentos,
    lotes,
  };
};

export default useInventario;
