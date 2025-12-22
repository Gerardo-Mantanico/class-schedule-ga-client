import { useCrud } from '../useCrud';
import { SesionesApi } from '../../service/sesiones.service';
import { Sesion } from '../../interfaces/historiaClinica/Sesiones';

export const useSesiones = () => {
  const {
    getItem: getItemSesion,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,

  } = useCrud<Sesion>(SesionesApi);

  return {
    getItemSesion,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
  };
};