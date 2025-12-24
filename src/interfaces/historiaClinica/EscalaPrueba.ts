export interface EscalaPruebaAplicada {
  id: number;
  hcId: number;
  prueba: number;
  fechaAplicacion: string;
  resultado: number;
  interpretacion: string;
  archivo?: string;      
  archivoFile?: File;    
}

