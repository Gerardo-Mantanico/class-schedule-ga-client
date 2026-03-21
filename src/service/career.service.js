import { createCrudService } from "./crud.factory";

const ENDPOINT_BASE = "/careers";
const baseService = createCrudService(ENDPOINT_BASE);

const normalizeCareer = (career) => {
  if (!career || typeof career !== "object") {
    return career;
  }

  const careerCode = Number(career.careerCode ?? career.id ?? 0);

  return {
    ...career,
    careerCode,
    id: careerCode,
    name: String(career.name ?? ""),
    active: Boolean(career.active),
  };
};

const normalizeCollection = (response) => {
  if (Array.isArray(response)) {
    return response.map(normalizeCareer);
  }

  if (!response || typeof response !== "object") {
    return response;
  }

  if (Array.isArray(response.content)) {
    return {
      ...response,
      content: response.content.map(normalizeCareer),
    };
  }

  if (Array.isArray(response.data)) {
    return {
      ...response,
      data: response.data.map(normalizeCareer),
    };
  }

  if (Array.isArray(response.items)) {
    return {
      ...response,
      items: response.items.map(normalizeCareer),
    };
  }

  if (Array.isArray(response.rows)) {
    return {
      ...response,
      rows: response.rows.map(normalizeCareer),
    };
  }

  if (Array.isArray(response.results)) {
    return {
      ...response,
      results: response.results.map(normalizeCareer),
    };
  }

  return normalizeCareer(response);
};

export const careerApi = {
  ...baseService,
  getAll: async (params = {}) => {
    const response = await baseService.getAll(params);
    return normalizeCollection(response);
  },
  get: async (id) => {
    const response = await baseService.get(id);
    return normalizeCareer(response);
  },
  create: async (payload) => {
    const response = await baseService.create({
      name: String(payload?.name ?? "").trim(),
    });
    return normalizeCollection(response);
  },
  update: async (id, payload) => {
    const response = await baseService.update(id, {
      name: String(payload?.name ?? "").trim(),
      active: true,
    });
    return normalizeCollection(response);
  },
};

export default careerApi;
