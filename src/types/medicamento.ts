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

export default Medicamento;
