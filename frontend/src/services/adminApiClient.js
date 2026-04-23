import axios from "axios";

const adminApiUrl = import.meta.env.VITE_ADMIN_API_URL;

if (!adminApiUrl) {
  throw new Error("Missing VITE_ADMIN_API_URL");
}

const adminApiClient = axios.create({
  baseURL: adminApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default adminApiClient;
