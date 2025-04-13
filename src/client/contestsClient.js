import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const CONTESTS = {
  async getContest(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.CONTESTS}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getContests(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.CONTESTS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createContest(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.CONTESTS}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateContest(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.CONTESTS}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteContest(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.CONTESTS}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateContestMeta(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.CONTESTS}/${slug}/meta/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default CONTESTS;