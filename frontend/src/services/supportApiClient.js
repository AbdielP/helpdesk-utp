import { createApiClient } from "./createApiClient";

const supportApiUrl = import.meta.env.VITE_SUPPORT_API_URL;

if (!supportApiUrl) {
  throw new Error("Missing VITE_SUPPORT_API_URL");
}

const supportApiClient = createApiClient(supportApiUrl);

export default supportApiClient;
