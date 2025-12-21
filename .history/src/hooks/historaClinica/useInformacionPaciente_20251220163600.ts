import { useCrud } from '../useCrud';
import { InformacionPacienteApi } from '../../service/InformacionPaciente.service';
import { InformacionPaciente } from '../../interfaces/historiaClinica/InformacionPaciente';


export const informacionPacienteUse = () => {
  const {
    getItem,
    loading,
    error, 
    createItem,
    updateItem
    } = useCrud<InformacionPaciente>(InformacionPacienteApi);

  return {
    getItem,
    loading,
    error, 
    createItem,
    updateItem
  };
};
