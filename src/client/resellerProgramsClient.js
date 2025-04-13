import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const RESELLER_PROGRAMS = {
  async getResellerProgram(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.RESELLER_PROGRAMS}/${slug}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getResellerProgramByUserId(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.RESELLER_PROGRAMS}/${slug}/user-id`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getResellerPrograms(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.RESELLER_PROGRAMS}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getResellerProgramReferrels(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.RESELLER_PROGRAMS}/${slug}/referrels`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createResellerProgram(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.RESELLER_PROGRAMS}/insert`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteResellerProgram(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.RESELLER_PROGRAMS}/${slug}/delete`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateResellerProgram(slug, params) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.RESELLER_PROGRAMS}/${slug}/update`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  }
};

export default RESELLER_PROGRAMS;