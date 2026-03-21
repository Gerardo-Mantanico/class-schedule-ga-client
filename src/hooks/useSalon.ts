import { useCrud } from "./useCrud";
import salonApi from "../service/salon.service.js";

export interface Salon {
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

type SalonPayload = {
  courseCode: number;
  name: string;
  semester: number;
  isCommonArea: boolean;
  isMandatory: boolean;
  hasLab: boolean;
  numberOfPeriods: number;
  typeOfSchedule: "MORNING" | "AFTERNOON";
};

const transformPayload = (data: unknown): SalonPayload => {
  const value = (data ?? {}) as Partial<Salon>;
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

export const useSalon = () => {
  const {
    items: salones,
    loading,
    error,
    fetchItems: fetchSalones,
    createItem: createSalon,
    updateItem: updateSalon,
    deleteItem: deleteSalon,
  } = useCrud<Salon>(salonApi, transformPayload);

  return {
    salones,
    loading,
    error,
    fetchSalones,
    createSalon,
    updateSalon,
    deleteSalon,
  };
};
