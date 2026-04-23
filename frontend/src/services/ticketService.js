import { ROLES } from "../constants/constants";
import adminApiClient from "./adminApiClient";
import supportApiClient from "./supportApiClient";
import userApiClient from "./userApiClient";

export const createTicket = async (ticketData) => {
  const { data } = await userApiClient.post("/ticket/new", ticketData);
  return data;
};

export const getTicketsByRole = async (role, userId) => {
  if (role === ROLES.ADMIN) {
    const { data } = await adminApiClient.get("/tickets");
    return data;
  }

  if (role === ROLES.SUPPORT) {
    const { data } = await supportApiClient.get("/tickets", {
      params: { userId },
    });
    return data;
  }

  const { data } = await userApiClient.get("/tickets", {
    params: { userId },
  });
  return data;
};

export const getSupportUsers = async () => {
  const { data } = await adminApiClient.get("/users", {
    params: { role: ROLES.SUPPORT },
  });

  return data;
};
