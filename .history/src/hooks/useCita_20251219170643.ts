import { useCrud } from './useCrud';
import { citaApi } from '../service/cita.service';
import { Cita } from '../interfaces/cita';




export const useCita = () => {
  const {
    items: citas,
    loading,
    error,
    fetchItems: fetchCitas,
    createItem: createCita,
    updateItem: updateCita,
    deleteItem: deleteCita
  } = useCrud<Cita>(citaApi);

  
  return {
    citas,
    loading,
    error,
    fetchCitas,
    createCita,
    updateCita,
    deleteCita,
  };
};
