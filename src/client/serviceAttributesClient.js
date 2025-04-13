import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const SERVICE_ATTRIBUTES = {
    async getServiceAttribute(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.SERVICE_ATTRIBUTES}/${slug}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getServiceAttributes(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.SERVICE_ATTRIBUTES}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createServiceAttribute(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.SERVICE_ATTRIBUTES}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateServiceAttribute(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.SERVICE_ATTRIBUTES}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteServiceAttribute(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.SERVICE_ATTRIBUTES}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default SERVICE_ATTRIBUTES;