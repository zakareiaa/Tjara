import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const AUTH = {
  async login(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.LOGIN}`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async loginWithJwt(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.LOGIN}/jwt`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async register(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.REGISTER}`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async registerContact(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.REGISTER}/contact`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async forgotPassword(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.FORGOT_PASSWORD}`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async resetPassword(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.RESET_PASSWORD}`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async smsVerification(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.SMS}/verify`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async resendSmsVerification(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.SMS}/resend`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },

  async resendVerificationEmail(params) {
    try {
      const response = await axiosClient.post(`/${API_ENDPOINTS.EMAIL}/resend`, params);
      return response.status == 200 ? { data: response.data, error: null } : { data: null, error: error.response };
    } catch (error) {
      return { data: null, error: error.response };
    }
  },
};

export default AUTH;
