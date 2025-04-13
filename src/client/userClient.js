import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const USER = {
    async getUser(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.USER}/${slug}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getUsers(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.USER}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createUser(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.USER}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateUser(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.USER}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteUser(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.USER}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default USER;