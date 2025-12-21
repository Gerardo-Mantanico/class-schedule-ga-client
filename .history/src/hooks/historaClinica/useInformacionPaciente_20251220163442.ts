import { useCrud } from './useCrud';
import { informacionPacienteApi } from '../../service/InformacionPaciente.service';
import { InformacionPaciente } from '../../interfaces/historiaClinica/InformacionPaciente';


export const informacionPacienteUse = () => {
  const {
    getItems,
    loading,
    error, 
    createItem,
    updateItem
 
  } = useCrud<InformacionPaciente>(informacionPacienteApi);

  return {
     getItems,
    loading,
    error, 
    createItem,
    updateItem
  };
};
