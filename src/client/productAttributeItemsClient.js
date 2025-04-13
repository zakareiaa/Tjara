import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const PRODUCT_ATTRIBUTE_ITEMS = {
  async getProductAttributeItemIdBySlug(slug) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTE_ITEMS}/id/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
  async getProductAttributeItem(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTE_ITEMS}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getProductAttributeItems(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTE_ITEMS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createProductAttributeItem(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTE_ITEMS}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateProductAttributeItem(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTE_ITEMS}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteProductAttributeItem(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.PRODUCT_ATTRIBUTE_ITEMS}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default PRODUCT_ATTRIBUTE_ITEMS;