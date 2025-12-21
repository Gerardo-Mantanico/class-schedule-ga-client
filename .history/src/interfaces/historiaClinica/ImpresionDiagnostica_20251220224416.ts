import { TipoImpresionDiagnostico } from "./TipoImprecion";

export interface ImpresionDiagnostica {
  id: number;
  hcId: number;
  diagnosticoPrincipalCie11: TipoImpresionDiagnostico;
  diagnosticoPrincipalDsm5: TipoImpresionDiagnostico;
  factoresPredisponentes: string;
  factoresPrecipiantes: string;
  factoresMantenedores: string;
  nivelFuncionamiento: number;
}