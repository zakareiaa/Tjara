import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const JOBS = {
  async getJob(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.JOBS}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getJobs(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.JOBS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createJob(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.JOBS}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateJob(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.JOBS}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteJob(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.JOBS}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateJobMeta(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.JOBS}/${slug}/meta/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default JOBS;