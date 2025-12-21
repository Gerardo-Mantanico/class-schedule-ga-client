
import { useCrud } from '../useCrud';
import { AntecedentesFamiliaresApi } from '../../service/antecedentesFamiliares.service';
import { AntecedentesFamiliares } from '../../interfaces/historiaClinica/AntecedentesFamiliares';


export const useAntecedentesFamiliares = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<AntecedentesFamiliares>(AntecedentesFamiliaresApi);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};