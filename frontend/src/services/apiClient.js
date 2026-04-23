import axios from "axios";

const authApiUrl = import.meta.env.VITE_AUTH_API_URL;

if (!authApiUrl) {
  throw new Error("Missing VITE_AUTH_API_URL");
}

const apiClient = axios.create({
  baseURL: authApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
