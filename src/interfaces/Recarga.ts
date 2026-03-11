export interface RecargaPayload {
  cuentaDigitalId: string;
  monto: number;
  moneda: string;
  referencia: string;
  medioPago: string;
  operadorId: number;
}

export interface Recarga {
  id: number;
  cuentaDigitalId: number;
  numeroCuenta?: number;
  monto: number;
  moneda: string;
  referencia: string;
  estado: string;
  medioPago: string;
  operadorId: number;
  fechaRecarga: string;
  createdAt: string;
  updatedAt: string;
}
