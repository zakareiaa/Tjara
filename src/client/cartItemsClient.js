import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const CART = {
    async getCartItem(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.CART}/${slug}`, { params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
    async getCartItemCount( params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.CART}/count`, { params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getCartItems(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.CART}`, { params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createCartItem(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.CART}/add-to-cart`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateCartItem(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.CART}/${slug}/update`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteCartItem(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.CART}/${slug}/delete`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default CART;