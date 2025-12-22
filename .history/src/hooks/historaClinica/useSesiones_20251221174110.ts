import { useCrud } from '../useCrud';
import { SesionesApi } from '../../service/sesiones.service';
import { Sesion } from '../../interfaces/historiaClinica/Sesiones';

export const useSesiones = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getAll,
  } = useCrud<Sesion>(SesionesApi);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getAll,
  };
};