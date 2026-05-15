import { createApiClient } from "./createApiClient";

const usersApiUrl = import.meta.env.VITE_USERS_API_URL;

if (!usersApiUrl) {
  throw new Error("Missing VITE_USERS_API_URL");
}

const usersApiClient = createApiClient(usersApiUrl);

export default usersApiClient;
