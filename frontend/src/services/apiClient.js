import { createApiClient } from "./createApiClient";

const authApiUrl = import.meta.env.VITE_AUTH_API_URL;

if (!authApiUrl) {
  throw new Error("Missing VITE_AUTH_API_URL");
}

const apiClient = createApiClient(authApiUrl);

export default apiClient;
