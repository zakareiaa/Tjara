import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const POST_ATTRIBUTES = {
    async getPostAttribute(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.POST_ATTRIBUTES}/${slug}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getPostAttributes(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.POST_ATTRIBUTES}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createPostAttribute(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.POST_ATTRIBUTES}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updatePostAttribute(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.POST_ATTRIBUTES}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deletePostAttribute(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.POST_ATTRIBUTES}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default POST_ATTRIBUTES;