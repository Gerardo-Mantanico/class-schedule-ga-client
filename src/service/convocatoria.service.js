import { createCrudService } from "./crud.factory.js";
import api from "./api.service";

const ENDPOINT_BASE = "/convocatorias";

const crud = createCrudService(ENDPOINT_BASE);

const looksLikeConvocatoria = (item) => {
	return (
		item &&
		typeof item === "object" &&
		("nombre" in item || "titulo" in item) &&
		"fechaInicio" in item &&
		"fechaFin" in item
	);
};

const normalizeConvocatoriasResponse = (response) => {
	if (Array.isArray(response)) {
		if (response.length === 0) return [];

		if (looksLikeConvocatoria(response[0])) {
			return response;
		}

		const nested = response
			.filter((item) => item && typeof item === "object" && Array.isArray(item.convocatorias))
			.flatMap((item) => item.convocatorias);

		return nested;
	}

	if (response && typeof response === "object") {
		if (Array.isArray(response.convocatorias)) {
			return response.convocatorias;
		}

		if (Array.isArray(response.content)) {
			return normalizeConvocatoriasResponse(response.content);
		}

		if (Array.isArray(response.data)) {
			return normalizeConvocatoriasResponse(response.data);
		}
	}

	return [];
};

export const convocatoriaApi = {
	...crud,
	getAll: async (params = {}) => {
		if (params?.congresoId !== undefined && params?.congresoId !== null) {
			if (params?.page !== undefined || params?.size !== undefined) {
				return await crud.getAll(params);
			}
			const response = await api.get(`${ENDPOINT_BASE}/congreso/${params.congresoId}`);
			return normalizeConvocatoriasResponse(response);
		}
		return await crud.getAll(params);
	},
};

export default convocatoriaApi;
