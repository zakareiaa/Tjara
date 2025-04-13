import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const PRODUCTS = {
  async getProductIdBySlug(slug) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCTS}/id/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getProduct(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCTS}/${slug}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getProducts(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCTS}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createProduct(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.PRODUCTS}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateProduct(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.PRODUCTS}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteProduct(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.PRODUCTS}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getProductChatsCount(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCTS}/${API_ENDPOINTS.CHATS}/count`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getProductChats(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCTS}/${API_ENDPOINTS.CHATS}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async insertProductChat(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.PRODUCTS}/chats/insert`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getProductChatMessages(slug) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCTS}/chats/${slug}/messages`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async insertProductChatMessage(slug, message) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.PRODUCTS}/chats/${slug}/messages/insert`, message);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateProductMeta(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.PRODUCTS}/${slug}/meta/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default PRODUCTS;