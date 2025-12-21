import { useCrud } from '../useCrud';
import { EvaluacionPeriodicaApi } from '../../service/evaluacionPeriodica.service';
import { EvaluacionPeriodica } from '../../interfaces/historiaClinica/EvaluacionPeriodica';

export const useEvaluacionPeriodica = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<EvaluacionPeriodica>(EvaluacionPeriodicaApi);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};