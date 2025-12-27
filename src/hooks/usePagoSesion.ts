import { useCrud } from './useCrud';
import { PagoSesionesApi } from '../service/pagoSesiones.service';
import { PagoSesion, PagoSesionInput } from '@/interfaces/PagoSesiones';

export const usePagoSesion = () => {
  const {
    items: pagos,
    loading,
    error,
    fetchItems: fetchPagos,
    createItem: createPago,
    updateItem: updatePago,
    deleteItem: deletePago
  } = useCrud<PagoSesion>(PagoSesionesApi);

  return {
    pagos,
    loading,
    error,
    fetchPagos,
    createPago,
    updatePago,
    deletePago,
  };
};