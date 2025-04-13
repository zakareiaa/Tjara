import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const PRODUCT_ATTRIBUTES = {
  async getProductAttribute(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTES}/${slug}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getProductAttributes(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTES}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createProductAttribute(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTES}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateProductAttribute(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTES}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteProductAttribute(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTES}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default PRODUCT_ATTRIBUTES;