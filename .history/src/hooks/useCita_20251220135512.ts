import { useState, useCallback } from "react";
import { useCrud } from './useCrud';
import { citaApi } from '../service/cita.service';
import { Cita } from '../interfaces/cita/cita';

export const useCita = () => {


  const {
    items: citas,
    loading,
    error,
    fetchItems: fetchCitasBase,
    createItem: createCita,
    updateItem: updateCita,
    deleteItem: deleteCita,
  } = useCrud<Cita>(citaApi);



  return {
    citas,
    loading,
    error,
    fetchCitas: fetchCitasBase,
    createCita,
    updateCita,
    deleteCita,
  
  };
};