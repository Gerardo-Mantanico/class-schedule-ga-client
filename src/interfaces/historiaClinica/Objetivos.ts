export interface ObjetivosHC {
  id:number;
  hcId: number;
  objetivoCortoplazo: string;
  objetivoMedioplazo: string;
  objetivoLargoplazo: string;
  modalidad: number[];
  enfoqueTerapeutico: number[];
  frecuencia: number;
  sesionesPorSemana: number;
  duracionEstimada: number;
  costoPorSesion: number;
}
