import { useState, useCallback } from "react";
import { citaApi } from '../service/cita.service';
import { Cita } from '../interfaces/cita/cita';


export const useCita = () => {
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sortBy: "id",
    ascending: true,
  });

  // Nueva función para obtener citas con filtros/paginación
  const fetchCitas = useCallback(() => {
    fetchCitasBase(params);
  }, [fetchCitasBase, params]);



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
    params,
    setParams,
  };
};