import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const JOB_ATTRIBUTES = {
  async getJobAttribute(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.JOB_ATTRIBUTES}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getJobAttributes(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.JOB_ATTRIBUTES}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createJobAttribute(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.JOB_ATTRIBUTES}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateJobAttribute(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.JOB_ATTRIBUTES}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteJobAttribute(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.JOB_ATTRIBUTES}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default JOB_ATTRIBUTES;
