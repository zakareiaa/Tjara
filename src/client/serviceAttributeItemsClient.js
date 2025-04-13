import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const SERVICE_ATTRIBUTE_ITEMS = {
    async getServiceAttributeItem(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.SERVICE_ATTRIBUTE_ITEMS}/${slug}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getServiceAttributeItems(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.SERVICE_ATTRIBUTE_ITEMS}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createServiceAttributeItem(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.SERVICE_ATTRIBUTE_ITEMS}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateServiceAttributeItem(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.SERVICE_ATTRIBUTE_ITEMS}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteServiceAttributeItem(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.SERVICE_ATTRIBUTE_ITEMS}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default SERVICE_ATTRIBUTE_ITEMS;