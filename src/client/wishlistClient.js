import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const WISHLIST = {
  async getWishlistItems(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.WISHLIST}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getWishlistItemsCount(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.WISHLIST}/count`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async insertWishlistItem(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.WISHLIST}/insert`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },


  async deleteWishlistItem(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.WISHLIST}/${slug}/delete`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default WISHLIST;