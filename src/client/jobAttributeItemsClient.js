import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const JOB_ATTRIBUTE_ITEMS = {
    async getJobAttributeItem(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.JOB_ATTRIBUTE_ITEMS}/${slug}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getJobAttributeItems(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.JOB_ATTRIBUTE_ITEMS}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createJobAttributeItem(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.JOB_ATTRIBUTE_ITEMS}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateJobAttributeItem(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.JOB_ATTRIBUTE_ITEMS}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteJobAttributeItem(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.JOB_ATTRIBUTE_ITEMS}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default JOB_ATTRIBUTE_ITEMS;