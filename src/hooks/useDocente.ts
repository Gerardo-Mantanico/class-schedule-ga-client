import { useCrud } from "./useCrud";
import docenteApi from "@/service/docente.service";
import type { Docente } from "@/interfaces/HorariosDemo";

const transformPayload = (data: unknown): Omit<Docente, "id"> => {
  const value = (data ?? {}) as Partial<Docente>;

  return {
    nombre: value.nombre ?? "",
    registroPersonal: String(value.registroPersonal ?? "").toUpperCase(),
    horaEntrada: value.horaEntrada ?? "07:00",
    horaSalida: value.horaSalida ?? "13:00",
    cursosPreferidos: Array.isArray(value.cursosPreferidos) ? value.cursosPreferidos : [],
  };
};

export const useDocente = () => {
  const {
    items: docentes,
    loading,
    error,
    fetchItems: fetchDocentes,
    createItem: createDocente,
    updateItem: updateDocente,
    deleteItem: deleteDocente,
  } = useCrud<Docente>(docenteApi, transformPayload);

  return {
    docentes,
    loading,
    error,
    fetchDocentes,
    createDocente,
    updateDocente,
    deleteDocente,
  };
};
