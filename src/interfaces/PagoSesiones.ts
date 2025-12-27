export interface PagoSesion {
  id: number;
  pacienteId: string;
  sessionId: number;
  monto: number;
  pagado: boolean;
  fechaPago: string;
  nota: string | null;
  comprobante: string | null;
  codigo: string;
  createdAt: string;
  updatedAt: string;
}


export interface PagoSesionInput {
  id: number;
  monto: number;
  nota: string;
  comprobante: string;
}