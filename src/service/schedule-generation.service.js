import api from "./api.service";

export const scheduleGenerationApi = {
  getCourses: async () => api.get("/courses"),
  getProfessors: async () => api.get("/professors"),
  getClassrooms: async () => api.get("/classrooms"),

  getConfigProfessors: async () => api.get("/config-professors"),
  createConfigProfessor: async (payload) => {
    return api.post("/config-professors", {
      ...payload,
    });
  },
  deleteConfigProfessor: async (configProfessorId) => {
    return api.delete(`/config-professors/${configProfessorId}`);
  },

  getConfigClassrooms: async () => api.get("/config-classrooms"),
  createConfigClassroom: async (payload) => {
    return api.post("/config-classrooms", {
      ...payload,
    });
  },
  deleteConfigClassroom: async (configClassroomId) => {
    return api.delete(`/config-classrooms/${configClassroomId}`);
  },

  getConfigCourses: async () => api.get("/config-courses"),
  createConfigCourse: async (payload) => {
    return api.post("/config-courses", {
      ...payload,
    });
  },
  deleteConfigCourse: async (configCourseId) => {
    return api.delete(`/config-courses/${configCourseId}`);
  },

  getConfigCourseProfessors: async () => api.get("/config-course-professors"),
  createConfigCourseProfessor: async (payload) => {
    return api.post("/config-course-professors", {
      ...payload,
    });
  },
  deleteConfigCourseProfessor: async (configCourseProfessorId) => {
    return api.delete(`/config-course-professors/${configCourseProfessorId}`);
  },

  generate: async (scheduleConfigId, name) => api.post(`/ga/generate/${scheduleConfigId}`, {
    name,
  }),
  getGeneratedSchedules: async () => api.get("/generated-schedules"),
  getGeneratedSchedule: async (generatedScheduleId, params = {}) => {
    return api.get(`/generated-schedules/${generatedScheduleId}`, { params });
  },
  patchGeneratedItem: async (generatedScheduleId, generatedScheduleItemId, payload) => {
    return api.patch(
      `/generated-schedules/${generatedScheduleId}/items/${generatedScheduleItemId}`,
      payload
    );
  },
};

export default scheduleGenerationApi;
