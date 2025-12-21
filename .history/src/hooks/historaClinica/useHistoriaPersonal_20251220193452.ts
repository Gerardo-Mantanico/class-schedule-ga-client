
import { useCrud } from '../useCrud';

import { HistoriaPersonalApi } from '../../service/historiaPersonal.service';
import { HistoriaPersonal } from '../../interfaces/historiaClinica/HistoriaPersonal';



export const useHistoriaPersonal = () => {
  const {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  } = useCrud<HistoriaPersonal>(HistoriaPersonalApi);

  return {
    getItem,
    loading,
    error,
    createItem,
    updateItem
  };
};