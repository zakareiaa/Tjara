import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const SHOPS = {
  async getShopIdBySlug(slug) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.SHOPS}/id/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getShop(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.SHOPS}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getShops(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.SHOPS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createShop(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.SHOPS}/insert`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteShop(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.SHOPS}/${slug}/delete`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateShop(slug, params) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.SHOPS}/${slug}/update`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  }
};

export default SHOPS;