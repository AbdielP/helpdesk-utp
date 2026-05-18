import { ROLES } from "../constants/constants";
import ticketsApiClient from "./ticketsApiClient";
import usersApiClient from "./usersApiClient";

export const createTicket = async (ticketData, requestConfig = {}) => {
  const { data } = await ticketsApiClient.post("/tickets", ticketData, requestConfig);
  return data;
};

export const getTicketsByRole = async (role, userId, requestConfig = {}) => {
  const { data } = await ticketsApiClient.get("/tickets", {
    ...requestConfig,
    params: { role, userId },
  });

  return data;
};

export const getTicketByRole = async (role, ticketId, userId, requestConfig = {}) => {
  const { data } = await ticketsApiClient.get(`/tickets/${ticketId}`, {
    ...requestConfig,
    params: { role, userId },
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

  if (role === ROLES.ADMIN || role === ROLES.SUPPORT) {
    await ticketsApiClient.patch(`/tickets/${ticketId}/status`, payload, requestConfig);
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
  await ticketsApiClient.patch(`/tickets/${ticketId}/assign`, {
    assigneeUserId: userId,
    actorUserId,
  }, requestConfig);
};

export const getUsersByRole = async (role, requestConfig = {}) => {
  const { data } = await usersApiClient.get("/users", {
    ...requestConfig,
    params: { role },
  });

  return data;
};

export const getSupportUsers = async (requestConfig = {}) =>
  getUsersByRole(ROLES.SUPPORT, requestConfig);
