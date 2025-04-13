import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const ORDERS = {
    async getOrder(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.ORDERS}/${slug}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getOrders(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.ORDERS}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createOrder(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.ORDERS}/insert`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateOrder(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.ORDERS}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteOrder(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.ORDERS}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default ORDERS;