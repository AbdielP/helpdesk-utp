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

export const getTicketByRole = async (role, ticketId, userId) => {
  if (role === ROLES.ADMIN) {
    const { data } = await adminApiClient.get(`/ticket/${ticketId}`);
    return data;
  }

  if (role === ROLES.SUPPORT) {
    const { data } = await supportApiClient.get(`/ticket/${ticketId}`, {
      params: { userId },
    });
    return data;
  }

  const { data } = await userApiClient.get(`/ticket/${ticketId}`, {
    params: { userId },
  });
  return data;
};

export const updateTicketStatusByRole = async (role, ticketId, status) => {
  const payload = { status };

  if (role === ROLES.ADMIN) {
    await adminApiClient.patch(`/ticket/${ticketId}/status`, payload);
    return;
  }

  if (role === ROLES.SUPPORT) {
    await supportApiClient.patch(`/ticket/${ticketId}/status`, payload);
    return;
  }

  throw new Error("Role not allowed to update ticket status");
};

export const assignTicketToSupport = async (ticketId, userId) => {
  await adminApiClient.patch(`/ticket/${ticketId}/assign`, {
    userId,
  });
};

export const getUsersByRole = async (role) => {
  const { data } = await adminApiClient.get("/users", {
    params: { role },
  });

  return data;
};

export const getSupportUsers = async () => getUsersByRole(ROLES.SUPPORT);

export const getKnownUsers = async () => {
  const [admins, supportUsers, endUsers] = await Promise.all([
    getUsersByRole(ROLES.ADMIN),
    getUsersByRole(ROLES.SUPPORT),
    getUsersByRole(ROLES.USER),
  ]);

  return [...admins, ...supportUsers, ...endUsers];
};
