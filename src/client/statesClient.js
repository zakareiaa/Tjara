import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const STATES = {
  async getState(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.STATES}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getStates(countryId, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.COUNTRIES}/${countryId}/${API_ENDPOINTS.STATES}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createState(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.STATES}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateState(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.STATES}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteState(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.STATES}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default STATES;