import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const SERVICES = {
  async getService(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.SERVICES}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getServices(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.SERVICES}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createService(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.SERVICES}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateService(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.SERVICES}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteService(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.SERVICES}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateServiceMeta(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.SERVICES}/${slug}/meta/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default SERVICES;