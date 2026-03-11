import { createCrudService } from "./crud.factory";

const ENDPOINT_BASE = "/salones";

export const salonApi = createCrudService(ENDPOINT_BASE);

export default salonApi;
