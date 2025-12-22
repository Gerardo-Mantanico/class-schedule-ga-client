import { useCrud } from '../useCrud';
import { AltaTerapeuticaApi } from '../../service/AltaTerapeutica.service';
import { AltaTerapeutica } from '../../interfaces/historiaClinica/AltaTerapeutica';

export const useAltaTerapeutica = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<AltaTerapeutica>(AltaTerapeuticaApi);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};