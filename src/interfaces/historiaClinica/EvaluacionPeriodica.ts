export interface EvaluacionPeriodica {
  id: number;
  hcId: number;
  fechaEvalucacion: string | null;
  tipoEvaluacion: number;
  progresoObservado: string;
  objetivoAlcanzado: string;
  objetivosPedientes: string;
  recomendaciones: string;
  escalaProgreso: number;
  modificacionPlanTratamiento: string;
  reevaluacionDiagnostico: string;
}