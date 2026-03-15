import { useCrud } from "./useCrud";
import horarioConfiguracionApi from "@/service/horarioConfiguracion.service";
import type { ConfiguracionHorario } from "@/interfaces/HorariosDemo";

const transformPayload = (data: unknown): Omit<ConfiguracionHorario, "id"> => {
  const value = (data ?? {}) as Partial<ConfiguracionHorario>;
  return {
    nombre: value.nombre ?? "",
    minutosPorPeriodo: Number(value.minutosPorPeriodo ?? 50),
    jornadaMananaInicio: value.jornadaMananaInicio ?? "07:00",
    jornadaMananaFin: value.jornadaMananaFin ?? "12:00",
    jornadaTardeInicio: value.jornadaTardeInicio ?? "13:00",
    jornadaTardeFin: value.jornadaTardeFin ?? "18:00",
    maxGeneraciones: Number(value.maxGeneraciones ?? 200),
    poblacionInicial: Number(value.poblacionInicial ?? 100),
    criterioFinalizacion: value.criterioFinalizacion ?? "max_generaciones",
    metodoSeleccion: value.metodoSeleccion ?? "torneo",
    metodoCruce: value.metodoCruce ?? "uniforme",
    metodoMutacion: value.metodoMutacion ?? "swap",
    activa: Boolean(value.activa),
  };
};

export const useConfiguracionHorarios = () => {
  const {
    items: configuraciones,
    loading,
    error,
    fetchItems: fetchConfiguraciones,
    createItem: createConfiguracion,
    updateItem: updateConfiguracion,
    deleteItem: deleteConfiguracion,
  } = useCrud<ConfiguracionHorario>(horarioConfiguracionApi, transformPayload);

  return {
    configuraciones,
    loading,
    error,
    fetchConfiguraciones,
    createConfiguracion,
    updateConfiguracion,
    deleteConfiguracion,
  };
};
