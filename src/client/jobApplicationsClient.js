import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const JOB_APPLICATIONS = {
    async insertJobApplication(slug, params) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.JOBS}/${slug}/applications/insert`, params, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getJobApplications(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.JOB_APPLICATIONS}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createJobApplication(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.JOB_APPLICATIONS}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateJobApplication(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.JOB_APPLICATIONS}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteJobApplication(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.JOB_APPLICATIONS}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default JOB_APPLICATIONS;