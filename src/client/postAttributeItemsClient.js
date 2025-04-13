import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const POST_ATTRIBUTE_ITEMS = {
    async getPostAttributeItem(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.POST_ATTRIBUTE_ITEMS}/${slug}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getPostAttributeItems(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.POST_ATTRIBUTE_ITEMS}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createPostAttributeItem(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.POST_ATTRIBUTE_ITEMS}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updatePostAttributeItem(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.POST_ATTRIBUTE_ITEMS}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deletePostAttributeItem(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.POST_ATTRIBUTE_ITEMS}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default POST_ATTRIBUTE_ITEMS;