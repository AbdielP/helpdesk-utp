import axios from "axios";

const DEFAULT_AUTH_API_URL = "http://localhost:5227";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL ?? DEFAULT_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
