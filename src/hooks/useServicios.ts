import { useCrud } from './useCrud';
import { servicioApi } from '../service';

interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  img?: string;
}

export const useServicios = () => {
  const transformPayload = (data: unknown) => {
    const typedData = data as Partial<Service> & { id?: number | string };
    return {
      ...typedData,
      id: typedData.id ? Number(typedData.id) : undefined,
      precio: typedData.precio ? Number(typedData.precio) : undefined,
      img: typedData.img === "" ? null : typedData.img
    };
  };

  const {
    items: services,
    loading,
    error,
    fetchItems: fetchServices,
    createItem: createService,
    updateItem: updateService,
    deleteItem: deleteService
  } = useCrud<Service>(servicioApi, transformPayload);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  };
};
