import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const CONTEST_PARTICIPATIONS = {
  async getContestParticipants(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.CONTEST_PARTICIPATIONS}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async insertContestParticipation(slug, params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.CONTESTS}/${slug}/participations/insert`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteContestParticipant(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.CONTEST_PARTICIPATIONS}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default CONTEST_PARTICIPATIONS;