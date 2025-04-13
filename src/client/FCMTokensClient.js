import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const FCMTokens = {
  async getFCMToken(userId, params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.FCMTokens}/${userId}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getFCMTokens(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.FCMTokens}`, { params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createFCMToken(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.FCMTokens}/create`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updateFCMToken(token, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.FCMTokens}/${token}/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createOrUpdateFCMToken(token, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.FCMTokens}/${token}/create-or-update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deleteFCMToken(token) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.FCMTokens}/${token}/delete`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default FCMTokens;
