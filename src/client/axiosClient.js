import axios from "axios";
import { decryptData, getChunkedCookies } from "../helpers/helpers";

/* ---------------------------------------------------------------------------------------------- */
/*                                   Base Setup For Axios Client                                  */
/* ---------------------------------------------------------------------------------------------- */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  timeout: 50_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------------------------------------------------------------------------------------- */
/*                      Request Interceptor To Add Authorization And User ID                      */
/* ---------------------------------------------------------------------------------------------- */
axiosClient.interceptors.request.use(
  (config) => {
    config.headers["X-Request-From"] = "Website";
    const user = getChunkedCookies("user");
    const decryptedData = user ? decryptData(user) : {};
    if (decryptedData && decryptedData?.authToken) {
      config.headers.Authorization = `Bearer ${decryptedData?.authToken}`;
      config.headers["User-ID"] = decryptedData?.id;
      config.headers["Shop-ID"] = decryptedData?.shop?.shop?.id;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------------------------------------------------------------------------------------- */
/*                          Response Interceptor To Handle Global Errors                          */
/* ---------------------------------------------------------------------------------------------- */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
