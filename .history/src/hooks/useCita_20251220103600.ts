import { useState, useCallback } from "react";
import { useCrud } from './useCrud';
import { citaApi } from '../service/cita.service';
import { Cita } from '../interfaces/cita/cita';

export const useCita = () => {
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sortBy: "id",
    ascending: true,
  });

  const {
    items: citas,
    loading,
    error,
    fetchItems: fetchCitasBase,
    createItem: createCita,
    updateItem: updateCita,
    deleteItem: deleteCita,
  } = useCrud<Cita>(citaApi);

  // Nueva función para obtener citas con filtros/paginación
  const fetchCitas = useCallback(() => {
    fetchCitasBase(params);
  }, [fetchCitasBase, params]);

  // Llama automáticamente al cargar o cuando cambian los filtros
  // (puedes quitar este useEffect si prefieres control manual)
  // useEffect(() => {
  //   fetchCitas();
  // }, [fetchCitas]);

  return {
    citas,
    loading,
    error,
    fetchCitas,
    createCita,
    updateCita,
    deleteCita,
    params,
    setParams,
  };
};