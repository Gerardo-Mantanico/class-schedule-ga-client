import { useCrud } from "./useCrud";
import cursoApi from "@/service/curso.service";
import type { Curso } from "@/interfaces/HorariosDemo";

const transformPayload = (data: unknown): Omit<Curso, "id"> => {
  const value = (data ?? {}) as Partial<Curso>;

  return {
    nombre: value.nombre ?? "",
    codigo: String(value.codigo ?? "").toUpperCase(),
    carrerasSemestres: Array.isArray(value.carrerasSemestres) ? value.carrerasSemestres : [],
    tipoHorario: value.tipoHorario ?? "AMBOS",
    tieneLab: Boolean(value.tieneLab),
    esAreaComun: Boolean(value.esAreaComun),
    semestreAreaComun: value.semestreAreaComun,
    obligatorioAreaComun: value.obligatorioAreaComun,
    periodos: Number(value.periodos ?? 1),
    usadoEnHorario: Boolean(value.usadoEnHorario),
  };
};

export const useCurso = () => {
  const {
    items: cursos,
    loading,
    error,
    fetchItems: fetchCursos,
    createItem: createCurso,
    updateItem: updateCurso,
    deleteItem: deleteCurso,
  } = useCrud<Curso>(cursoApi, transformPayload);

  return {
    cursos,
    loading,
    error,
    fetchCursos,
    createCurso,
    updateCurso,
    deleteCurso,
  };
};
