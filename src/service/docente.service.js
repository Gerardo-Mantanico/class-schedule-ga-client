import { createDemoCrudService } from "./demoCrud.service";
import { docentesSeed } from "./demoSeed.data";

const baseService = createDemoCrudService({
  storageKey: "demo:docentes",
  seed: docentesSeed,
  sortBy: "nombre",
});

const normalizeRegistro = (value) => String(value || "").trim().toUpperCase();

const validateDocente = async (payload, idToIgnore = null) => {
  if (!payload.nombre?.trim()) throw new Error("El nombre es obligatorio");
  if (!payload.registroPersonal?.trim()) throw new Error("El registro de personal es obligatorio");
  if (!payload.horaEntrada || !payload.horaSalida) throw new Error("Debes indicar hora de entrada y salida");

  const docentes = await baseService.getAll();
  const registro = normalizeRegistro(payload.registroPersonal);
  const duplicate = docentes.find(
    (docente) =>
      normalizeRegistro(docente.registroPersonal) === registro && String(docente.id) !== String(idToIgnore)
  );

  if (duplicate) {
    throw new Error("No deben existir docentes con el mismo registro de personal");
  }
};

export const docenteApi = {
  ...baseService,
  create: async (payload) => {
    await validateDocente(payload);
    return baseService.create({
      ...payload,
      registroPersonal: normalizeRegistro(payload.registroPersonal),
      cursosPreferidos: Array.isArray(payload.cursosPreferidos) ? payload.cursosPreferidos : [],
    });
  },
  update: async (id, payload) => {
    await validateDocente(payload, id);
    return baseService.update(id, {
      ...payload,
      registroPersonal: normalizeRegistro(payload.registroPersonal),
      cursosPreferidos: Array.isArray(payload.cursosPreferidos) ? payload.cursosPreferidos : [],
    });
  },
};

export default docenteApi;
