import axios from "axios";

const supportApiUrl = import.meta.env.VITE_SUPPORT_API_URL;

if (!supportApiUrl) {
  throw new Error("Missing VITE_SUPPORT_API_URL");
}

const supportApiClient = axios.create({
  baseURL: supportApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default supportApiClient;
