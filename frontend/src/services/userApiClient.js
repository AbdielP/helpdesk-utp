import { createApiClient } from "./createApiClient";

const userApiUrl = import.meta.env.VITE_USER_API_URL;

if (!userApiUrl) {
  throw new Error("Missing VITE_USER_API_URL");
}

const userApiClient = createApiClient(userApiUrl);

export default userApiClient;
