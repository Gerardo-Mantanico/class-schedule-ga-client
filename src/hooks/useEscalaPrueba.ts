import { useCrud } from './useCrud';
import { EscalasPruebasApi } from '../service/escalasPruebas.service';
import { EscalaPruebaAplicada } from '@/interfaces/historiaClinica/EscalaPrueba';

export const useEscalaPrueba = () => {
  const {
   
    loading,
    error,
    createItem,
    getItem: list,
    deleteItem,
    createFormDataItem
  } = useCrud<EscalaPruebaAplicada>(EscalasPruebasApi);

  return {

    loading,
    error,
    createItem,
    deleteItem,
    list,
    createFormDataItem
  };
};
