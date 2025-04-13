import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const CITIES = {
  async getCity(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.CITIES}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getCities(stateId, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.STATES}/${stateId}/${API_ENDPOINTS.CITIES}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createCity(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.CITIES}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateCity(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.CITIES}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteCity(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.CITIES}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default CITIES;