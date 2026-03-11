export interface Sesion {
  id: number;
  hcId: number;
  fecha: string; // ISO date string
  numeroSesiones: number;
  asistencia: boolean;
  justificacionInasistencia: string;
  temasAbordados: string;
  intervencionesRealizadas: string;
  repuestaPaciente: string;
  tcongresosAsignadas: string;
  observaciones: string;
  proximaCita: string; 
  firmaPsicologo: string;
}