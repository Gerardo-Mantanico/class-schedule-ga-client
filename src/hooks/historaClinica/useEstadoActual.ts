import { useCrud } from '../useCrud';
import { EstadoActual } from '../../interfaces/historiaClinica/EstadoActual';
import { EstadoActualApi } from '../../service/estadoActual.service';

export const useEstadoActual = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<EstadoActual>(EstadoActualApi);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};