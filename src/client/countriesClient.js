import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const COUNTRIES = {
    async getCountry(slug, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.COUNTRIES}/${slug}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async getCountries(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.COUNTRIES}`, { params: params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createCountry(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.COUNTRIES}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateCountry(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.COUNTRIES}/${slug}`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteCountry(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.COUNTRIES}/${slug}`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default COUNTRIES;