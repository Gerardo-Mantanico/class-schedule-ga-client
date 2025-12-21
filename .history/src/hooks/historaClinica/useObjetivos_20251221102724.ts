
import { useCrud } from '../useCrud';
import { ObjetivosApi } from '../../service/objetivos.service';
import { ObjetivosHC } from '../../interfaces/historiaClinica/Objetivos';


export const useAntecedentesFamiliares = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<ObjetivosHC>(ObjetivosApi);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};