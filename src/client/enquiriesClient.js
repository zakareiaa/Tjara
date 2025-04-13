import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const ENQUIRIES = {
    async getEnquiry(id, params) {
        try {
            const response = await axiosClient.get(`/${API_ENDPOINTS.ENQUIRIES}/${id}`, { params });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async getEnquiries(params) {
        try {
            const response = await axiosClient.get(`/${API_ENDPOINTS.ENQUIRIES}`, { params });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async insertEnquiry(data) {
        try {
            const response = await axiosClient.post(`/${API_ENDPOINTS.ENQUIRIES}/insert`, data);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async updateEnquiry(slug, data) {
        try {
            const response = await axiosClient.put(`/${API_ENDPOINTS.ENQUIRIES}/${slug}/update`, data);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async deleteEnquiry(slug) {
        try {
            const response = await axiosClient.delete(`/${API_ENDPOINTS.ENQUIRIES}/${slug}/delete`);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

};

export default ENQUIRIES;