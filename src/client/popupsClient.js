import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const POPUPS = {
  async getPopup(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.POPUPS}/get`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async getPopups(params) {
    try {
      const response = await axiosClient.get(`/${API_ENDPOINTS.POPUPS}`, { params: params });
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async createPopup(data) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.POPUPS}/insert`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async updatePopup(slug, data) {
    try {
      const response = await axiosClient.put(`/${API_ENDPOINTS.POPUPS}/${slug}/update`, data);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async deletePopup(slug) {
    try {
      const response = await axiosClient.delete(`/${API_ENDPOINTS.POPUPS}/${slug}/delete`);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
  async updatePopupWinner(id, params) {
    try {
      const response = await axiosClient.put(`/contests/${id}/winner/update`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default POPUPS;
