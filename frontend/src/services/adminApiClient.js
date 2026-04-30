import { createApiClient } from "./createApiClient";

const adminApiUrl = import.meta.env.VITE_ADMIN_API_URL;

if (!adminApiUrl) {
  throw new Error("Missing VITE_ADMIN_API_URL");
}

const adminApiClient = createApiClient(adminApiUrl);

export default adminApiClient;
