import { createApiClient } from "./createApiClient";

export const notificationsApiUrl = import.meta.env.VITE_NOTIFICATIONS_API_URL;

if (!notificationsApiUrl) {
  throw new Error("Missing VITE_NOTIFICATIONS_API_URL");
}

const notificationsApiClient = createApiClient(notificationsApiUrl);

export default notificationsApiClient;
