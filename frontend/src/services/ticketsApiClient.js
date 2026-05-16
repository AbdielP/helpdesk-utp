import { createApiClient } from "./createApiClient";

const ticketsApiUrl = import.meta.env.VITE_TICKETS_API_URL;

if (!ticketsApiUrl) {
  throw new Error("Missing VITE_TICKETS_API_URL");
}

const ticketsApiClient = createApiClient(ticketsApiUrl);

export default ticketsApiClient;
