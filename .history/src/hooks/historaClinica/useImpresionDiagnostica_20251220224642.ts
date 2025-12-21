import { useCrud } from '../useCrud';
import { ImpresionDiagnostica } from '../../interfaces/historiaClinica/ImpresionDiagnostica';
import { TipoImpresionDiagnostico } from '../../interfaces/historiaClinica/TipoImprecion';
import { ImpresionDiagnosticoApi, C11Api, D5Api } from '../../service/ImpresionDiagnostico.service';

// Hook para ImpresionDiagnostica
export const useImpresionDiagnostica = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<ImpresionDiagnostica>(ImpresionDiagnosticoApi);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};

// Hook para TipoImpresionDiagnostico (CIE-11)
export const useTipoImpresionDiagnosticoC11 = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<TipoImpresionDiagnostico>(C11Api);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};

// Hook para TipoImpresionDiagnostico (DSM-5)
export const useTipoImpresionDiagnosticoD5 = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<TipoImpresionDiagnostico>(D5Api);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};