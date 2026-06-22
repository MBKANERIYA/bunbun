import axios from 'axios';

const defaultApiBaseUrl = import.meta.env.PROD ? "" : "http://localhost:4000";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl).replace(/\/$/, "");

export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Global Axios Request Interceptor to attach auth headers
axios.interceptors.request.use(
    (config) => {
        try {
            const authData = JSON.parse(localStorage.getItem("authToken"));
            if (authData && authData.token) {
                config.headers["auth"] = `Bearer ${authData.token}`;
            }
        } catch (e) {
            console.error("Error parsing auth data from localStorage", e);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API_BASE_URL;
