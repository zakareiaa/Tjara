import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const MEMBERSHIP_PLANS = {
    async getMembershipPlan(id, params) {
        try {
            const response = await axiosClient.get(`/${API_ENDPOINTS.MEMBERSHIP_PLANS}/${id}`, { params });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async getMembershipPlans(params) {
        try {
            const response = await axiosClient.get(`/${API_ENDPOINTS.MEMBERSHIP_PLANS}`, { params });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async createMembershipPlan(data) {
        try {
            const response = await axiosClient.post(`/${API_ENDPOINTS.MEMBERSHIP_PLANS}/insert`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async updateMembershipPlan(slug, data) {
        try {
            const response = await axiosClient.put(`/${API_ENDPOINTS.MEMBERSHIP_PLANS}/${slug}/update`, data);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async updateShopMembership(data) {
        try {
            const response = await axiosClient.put(`/${API_ENDPOINTS.MEMBERSHIP_PLANS}/membership/update`, data);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },

    async deleteMembershipPlan(slug) {
        try {
            const response = await axiosClient.delete(`/${API_ENDPOINTS.MEMBERSHIP_PLANS}/${slug}/delete`);
            return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
        } catch (error) {
            return { data: null, error: error.response };
        }
    },
};

export default MEMBERSHIP_PLANS;