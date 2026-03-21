import { useCrud } from "./useCrud";
import cursoApi from "@/service/curso.service";

export interface Curso {
  id: number;
  courseCode?: number;
  name: string;
  semester: number;
  isCommonArea: boolean;
  isMandatory: boolean;
  hasLab: boolean;
  numberOfPeriods: number;
  typeOfSchedule: "MORNING" | "AFTERNOON";
  active?: boolean;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string;
  updatedBy?: string | null;
}

type CursoPayload = {
  courseCode: number;
  name: string;
  semester: number;
  isCommonArea: boolean;
  isMandatory: boolean;
  hasLab: boolean;
  numberOfPeriods: number;
  typeOfSchedule: "MORNING" | "AFTERNOON";
};

const transformPayload = (data: unknown): CursoPayload => {
  const value = (data ?? {}) as Partial<Curso>;
  const normalizedSchedule =
    String(value.typeOfSchedule ?? "MORNING").toUpperCase() === "AFTERNOON"
      ? "AFTERNOON"
      : "MORNING";

  return {
    courseCode: Number(value.courseCode ?? value.id ?? 0),
    name: String(value.name ?? "").trim(),
    semester: Number(value.semester ?? 1),
    isCommonArea: Boolean(value.isCommonArea),
    isMandatory: Boolean(value.isMandatory ?? true),
    hasLab: Boolean(value.hasLab),
    numberOfPeriods: Number(value.numberOfPeriods ?? 1),
    typeOfSchedule: normalizedSchedule,
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
