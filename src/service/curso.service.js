import { createDemoCrudService } from "./demoCrud.service";
import { cursosSeed } from "./demoSeed.data";

const baseService = createDemoCrudService({
  storageKey: "demo:cursos",
  seed: cursosSeed,
  sortBy: "nombre",
});

const normalizeCode = (value) => String(value || "").trim().toUpperCase();

const validateCurso = async (payload, idToIgnore = null) => {
  const cursos = await baseService.getAll();
  const code = normalizeCode(payload.codigo);
  if (!code) throw new TypeError("El código del curso es obligatorio");

  const duplicate = cursos.find(
    (curso) => normalizeCode(curso.codigo) === code && String(curso.id) !== String(idToIgnore)
  );
  if (duplicate) throw new TypeError("No deben existir cursos con el mismo código");

  if (!Array.isArray(payload.carrerasSemestres)) {
    throw new TypeError("Debes enviar carreras y semestres");
  }

  if (payload.esAreaComun) {
    if (!payload.semestreAreaComun || Number(payload.semestreAreaComun) <= 0) {
      throw new TypeError("Si el curso es de área común debe tener semestre asignado");
    }
    if (typeof payload.obligatorioAreaComun !== "boolean") {
      throw new TypeError("Si el curso es de área común debes indicar si es obligatorio");
    }
  } else if (payload.carrerasSemestres.length === 0) {
    throw new TypeError("El curso debe tener al menos una carrera y semestre");
  }

  if (Number(payload.periodos || 0) <= 0) {
    throw new TypeError("El número de periodos debe ser mayor a cero");
  }
};

export const cursoApi = {
  ...baseService,
  create: async (payload) => {
    await validateCurso(payload);
    return baseService.create({
      ...payload,
      codigo: normalizeCode(payload.codigo),
      usadoEnHorario: false,
    });
  },
  update: async (id, payload) => {
    await validateCurso(payload, id);
    return baseService.update(id, {
      ...payload,
      codigo: normalizeCode(payload.codigo),
    });
  },
  delete: async (id) => {
    const curso = await baseService.get(id);
    if (curso?.usadoEnHorario) {
      throw new Error("No puedes eliminar un curso usado para generar horarios");
    }
    return baseService.delete(id);
  },
};

export default cursoApi;
