import { TipoImpresionDiagnostico } from "./TipoImprecion";

export interface ImpresionDiagnostica {
  id: number;
  hcId: number;
  diagnosticoPrincipalCie11: number;
  diagnosticoPrincipalDsm5: number;
  factoresPredisponentes: string;
  factoresPrecipiantes: string;
  factoresMantenedores: string;
  nivelFuncionamiento: number;
}