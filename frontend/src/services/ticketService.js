import { ROLES } from "../constants/constants";
import ticketsApiClient from "./ticketsApiClient";
import usersApiClient from "./usersApiClient";

export const createTicket = async (ticketData, requestConfig = {}) => {
  const { data } = await ticketsApiClient.post("/tickets", ticketData, requestConfig);
  return data;
};

export const getTickets = async (requestConfig = {}) => {
  const { data } = await ticketsApiClient.get("/tickets", requestConfig);

  return data;
};

export const getTicket = async (ticketId, requestConfig = {}) => {
  const { data } = await ticketsApiClient.get(`/tickets/${ticketId}`, requestConfig);

  return data;
};

export const updateTicketStatus = async (ticketId, status, requestConfig = {}) => {
  await ticketsApiClient.patch(`/tickets/${ticketId}/status`, { status }, requestConfig);
};

export const assignTicketToSupport = async (ticketId, userId, requestConfig = {}) => {
  await ticketsApiClient.patch(`/tickets/${ticketId}/assign`, {
    assigneeUserId: userId,
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
