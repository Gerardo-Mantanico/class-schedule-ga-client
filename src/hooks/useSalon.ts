import { useCrud } from "./useCrud";
import salonApi from "@/service/salon.service";

export interface Salon {
  id: number;
  nombre: string;
  codigoInterno?: string;
  tipo?: "LAB" | "CURSO" | "AMBOS";
  tipoHorario?: "MANANA" | "TARDE" | "AMBOS";
  ubicacion: string;
  capacidad: number;
  recursos: string;
  estado: string;
  usadoEnHorario?: boolean;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type SalonPayload = {
  nombre: string;
  codigoInterno: string;
  tipo: "LAB" | "CURSO" | "AMBOS";
  tipoHorario: "MANANA" | "TARDE" | "AMBOS";
  ubicacion: string;
  capacidad: number;
  recursos: string;
  estado: string;
  activo: boolean;
};

const transformPayload = (data: unknown): SalonPayload => {
  const value = (data ?? {}) as Partial<Salon>;
  const normalizedEstado = String(value.estado ?? "ACTIVO").trim() || "ACTIVO";
  const normalizedEstadoUpper = normalizedEstado.toUpperCase();
  const normalizedActivo =
    typeof value.activo === "boolean" ? value.activo : normalizedEstadoUpper === "ACTIVO";

  return {
    nombre: value.nombre ?? "",
    codigoInterno: value.codigoInterno ?? "SIN-CODIGO",
    tipo: value.tipo ?? "AMBOS",
    tipoHorario: value.tipoHorario ?? "AMBOS",
    ubicacion: value.ubicacion ?? "",
    capacidad: Number(value.capacidad ?? 0),
    recursos: value.recursos ?? "",
    estado: normalizedEstado,
    activo: normalizedActivo,
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
