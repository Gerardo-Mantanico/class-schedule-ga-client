import { useCrud } from './useCrud';
import { areaApi } from '../service/area.service';

export interface Area {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const useArea = () => {
  const {
    items: areas,
    loading,
    error,
    fetchItems: fetchAreas,
    createItem: createArea,
    updateItem: updateArea,
    deleteItem: deleteArea
  } = useCrud<Area>(areaApi);

  return {
    areas,
    loading,
    error,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
  };
};
