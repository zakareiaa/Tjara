import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const NOTIFICATIONS = {
    async getNotification(slug, params) {
        try {
            const response = await axiosClient.get(`/${API_ENDPOINTS.NOTIFICATIONS}/${slug}`, { params });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async getNotifications(params) {
        try {
            const response = await axiosClient.get(`/${API_ENDPOINTS.NOTIFICATIONS}`, { params });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async getNotificationsCount(params) {
        try {
            const response = await axiosClient.get(`/${API_ENDPOINTS.NOTIFICATIONS}/count`, { params });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async createNotification(data) {
        try {
            const response = await axiosClient.post(`/${API_ENDPOINTS.NOTIFICATIONS}/insert`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async updateNotification(slug, data) {
        try {
            const response = await axiosClient.put(`/${API_ENDPOINTS.NOTIFICATIONS}/${slug}/update`, data);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async deleteNotification(slug) {
        try {
            const response = await axiosClient.delete(`/${API_ENDPOINTS.NOTIFICATIONS}/${slug}/delete`);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async deleteAllNotifications() {
        try {
            const response = await axiosClient.delete(`/${API_ENDPOINTS.NOTIFICATIONS}/all/delete`);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },
};

export default NOTIFICATIONS;