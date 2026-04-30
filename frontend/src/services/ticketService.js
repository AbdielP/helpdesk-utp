import { ROLES } from "../constants/constants";
import adminApiClient from "./adminApiClient";
import supportApiClient from "./supportApiClient";
import userApiClient from "./userApiClient";

export const createTicket = async (ticketData, requestConfig = {}) => {
  const { data } = await userApiClient.post("/ticket/new", ticketData, requestConfig);
  return data;
};

export const getTicketsByRole = async (role, userId, requestConfig = {}) => {
  if (role === ROLES.ADMIN) {
    const { data } = await adminApiClient.get("/tickets", requestConfig);
    return data;
  }

  if (role === ROLES.SUPPORT) {
    const { data } = await supportApiClient.get("/tickets", {
      ...requestConfig,
      params: { userId },
    });
    return data;
  }

  const { data } = await userApiClient.get("/tickets", {
    ...requestConfig,
    params: { userId },
  });
  return data;
};

export const getTicketByRole = async (role, ticketId, userId, requestConfig = {}) => {
  if (role === ROLES.ADMIN) {
    const { data } = await adminApiClient.get(`/ticket/${ticketId}`, requestConfig);
    return data;
  }

  if (role === ROLES.SUPPORT) {
    const { data } = await supportApiClient.get(`/ticket/${ticketId}`, {
      ...requestConfig,
      params: { userId },
    });
    return data;
  }

  const { data } = await userApiClient.get(`/ticket/${ticketId}`, {
    ...requestConfig,
    params: { userId },
  });
  return data;
};

export const updateTicketStatusByRole = async (
  role,
  ticketId,
  status,
  actorUserId,
  requestConfig = {},
) => {
  const payload = { status, actorUserId };

  if (role === ROLES.ADMIN) {
    await adminApiClient.patch(`/ticket/${ticketId}/status`, payload, requestConfig);
    return;
  }

  if (role === ROLES.SUPPORT) {
    await supportApiClient.patch(`/ticket/${ticketId}/status`, payload, requestConfig);
    return;
  }

  throw new Error("Role not allowed to update ticket status");
};

export const assignTicketToSupport = async (
  ticketId,
  userId,
  actorUserId,
  requestConfig = {},
) => {
  await adminApiClient.patch(`/ticket/${ticketId}/assign`, {
    assigneeUserId: userId,
    actorUserId,
  }, requestConfig);
};

export const getUsersByRole = async (role, requestConfig = {}) => {
  const { data } = await adminApiClient.get("/users", {
    ...requestConfig,
    params: { role },
  });

  return data;
};

export const getSupportUsers = async (requestConfig = {}) =>
  getUsersByRole(ROLES.SUPPORT, requestConfig);
