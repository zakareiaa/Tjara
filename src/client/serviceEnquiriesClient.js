import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const SERVICE_ENQUIRIES = {
    async insertServiceEnquiry(slug, params) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.SERVICES}/${slug}/enquiry/insert`, params);
        
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getServiceEnquiries(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.SERVICE_ENQUIRIES}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createServiceEnquiry(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.SERVICE_ENQUIRIES}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateServiceEnquiry(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.SERVICE_ENQUIRIES}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteServiceEnquiry(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.SERVICE_ENQUIRIES}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },

  };

  export default SERVICE_ENQUIRIES;