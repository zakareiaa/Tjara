import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const POSTS = {
  async getPost(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.POSTS}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getPosts(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.POSTS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createPost(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.POSTS}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updatePost(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.POSTS}/${slug}`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deletePost(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.POSTS}/${slug}`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updatePostMeta(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.POSTS}/${slug}/meta/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default POSTS;
