import { createDemoCrudService } from "./demoCrud.service";
import { salonesSeed } from "./demoSeed.data";

const baseService = createDemoCrudService({
	storageKey: "demo:salones",
	seed: salonesSeed,
	sortBy: "nombre",
});

const normalizeName = (value) => String(value || "").trim().toLowerCase();

const validateSalon = async (payload, idToIgnore = null) => {
	if (!payload.nombre?.trim()) throw new Error("El nombre del salón es obligatorio");
	if (!payload.codigoInterno?.trim() && !payload.id) throw new Error("El id/código interno del salón es obligatorio");
	if (Number(payload.capacidad || 0) <= 0) throw new Error("La cantidad de estudiantes debe ser mayor a cero");
	if (!["LAB", "CURSO", "AMBOS"].includes(String(payload.tipo || "AMBOS").toUpperCase())) {
		throw new Error("El tipo de salón debe ser lab, curso o ambos");
	}

	const salones = await baseService.getAll();
	const duplicate = salones.find(
		(salon) => normalizeName(salon.nombre) === normalizeName(payload.nombre) && String(salon.id) !== String(idToIgnore)
	);

	if (duplicate) {
		throw new Error("No deben existir salones con el mismo nombre");
	}
};

export const salonApi = {
	...baseService,
	create: async (payload) => {
		await validateSalon(payload);
		return baseService.create({
			...payload,
			codigoInterno: payload.codigoInterno || payload.id || "SIN-CODIGO",
			tipo: String(payload.tipo || "AMBOS").toUpperCase(),
			tipoHorario: String(payload.tipoHorario || "AMBOS").toUpperCase(),
			estado: payload.estado || "ACTIVO",
			usadoEnHorario: false,
		});
	},
	update: async (id, payload) => {
		await validateSalon(payload, id);
		return baseService.update(id, {
			...payload,
			tipo: String(payload.tipo || "AMBOS").toUpperCase(),
			tipoHorario: String(payload.tipoHorario || "AMBOS").toUpperCase(),
		});
	},
	delete: async (id) => {
		const salon = await baseService.get(id);
		if (salon?.usadoEnHorario) {
			throw new Error("No puedes eliminar un salón usado para un horario");
		}
		return baseService.delete(id);
	},
};

export default salonApi;
