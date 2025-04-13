import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const PRODUCT_BIDS = {
  async insertProductBid(slug, params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.PRODUCTS}/${slug}/bids/insert`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getProductBids(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCTS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createProductBids(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.PRODUCTS}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateProductBids(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.PRODUCTS}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteProductBids(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.PRODUCTS}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default PRODUCT_BIDS;