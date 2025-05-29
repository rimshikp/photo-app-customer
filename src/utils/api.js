import axios from "axios";
import { backendUrl } from "./config";
const api = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const noAuthApi = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { api, noAuthApi };
