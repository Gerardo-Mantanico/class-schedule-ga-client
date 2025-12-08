import { useCrud } from './useCrud';
import { especialidadApi } from '../service/especialidad.service';

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
  // Agrega aquí otros campos si es necesario
}

export const useEspecialidad = () => {
  const {
    items: especialidades,
    loading,
    error,
    fetchItems: fetchEspecialidades,
    createItem: createEspecialidad,
    updateItem: updateEspecialidad,
    deleteItem: deleteEspecialidad
  } = useCrud<Especialidad>(especialidadApi);

  return {
    especialidades,
    loading,
    error,
    fetchEspecialidades,
    createEspecialidad,
    updateEspecialidad,
    deleteEspecialidad,
  };
};
