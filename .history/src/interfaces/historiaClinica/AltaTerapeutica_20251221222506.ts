export interface AltaTerapeutica {
  id: number;
  hcId: number;
  fechaAlta: string; // ISO date string
  motivoAlta: number;
  estadoAlta: string;
  recomendacionesPosteriores: string;
  seguimientoProgramada: boolean;
  fechaSeguimiento: string; // ISO date string (YYYY-MM-DD)
  firmaPaciente: string;
  firmaPsicologo: string;
}