import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const MEDIA = {  
    async getMedia(id, params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.MEDIA}/${id}`, { params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },

    async getMedias(params) {
      try {
        const response = await axiosClient.get(`/${API_ENDPOINTS.MEDIA}`, { params });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async createMedia(data) {
      try {
        const response = await axiosClient.post(`/${API_ENDPOINTS.MEDIA}/insert`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async updateMedia(slug, data) {
      try {
        const response = await axiosClient.put(`/${API_ENDPOINTS.MEDIA}/${slug}/update`, data);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  
    async deleteMedia(slug) {
      try {
        const response = await axiosClient.delete(`/${API_ENDPOINTS.MEDIA}/${slug}/delete`);
        return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
      } catch (error) {
        return { data: null, error: error.response };
      }
    },
  };

  export default MEDIA;