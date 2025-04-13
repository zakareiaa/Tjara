import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const SETTINGS = {
  async getSetting(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.SETTINGS}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getSettings(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.SETTINGS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
  async createSetting(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.SETTINGS}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateSettings(data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.SETTINGS}/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteSetting(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.SETTINGS}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default SETTINGS;
