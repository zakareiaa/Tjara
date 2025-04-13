import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const CONTEST_COMMENTS = {
  async getComment(slug, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.CONTEST_COMMENTS}/${slug}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getComments(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.CONTEST_COMMENTS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async insertComment(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.CONTEST_COMMENTS}/insert`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateComment(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.CONTEST_COMMENTS}/${slug}/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteComment(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.CONTEST_COMMENTS}/${slug}/delete`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateCommentMeta(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.CONTEST_COMMENTS}/${slug}/meta/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default CONTEST_COMMENTS;
