import { ROLES } from "../constants/constants";
import ticketsApiClient from "./ticketsApiClient";
import usersApiClient from "./usersApiClient";

/**
 * Crea un ticket con los datos capturados en el formulario del usuario final.
 *
 * @param {{ title: string, description: string, category: string, priority: string }} ticketData
 * @param {import("axios").AxiosRequestConfig} [requestConfig]
 */
export const createTicket = async (ticketData, requestConfig = {}) => {
  const { data } = await ticketsApiClient.post("/tickets", ticketData, requestConfig);
  return data;
};

/**
 * Trae los tickets visibles para el usuario actual. El backend decide el alcance segun el rol.
 *
 * @param {import("axios").AxiosRequestConfig} [requestConfig]
 */
export const getTickets = async (requestConfig = {}) => {
  const { data } = await ticketsApiClient.get("/tickets", requestConfig);

  return data;
};

/**
 * Carga el detalle de un ticket, incluyendo historial y usuarios relacionados.
 *
 * @param {string} ticketId Identificador del ticket.
 * @param {import("axios").AxiosRequestConfig} [requestConfig]
 */
export const getTicket = async (ticketId, requestConfig = {}) => {
  const { data } = await ticketsApiClient.get(`/tickets/${ticketId}`, requestConfig);

  return data;
};

/**
 * Cambia el estado de un ticket desde las vistas de soporte o administracion.
 *
 * @param {string} ticketId Identificador del ticket.
 * @param {string} status Nuevo estado visible para el usuario.
 * @param {import("axios").AxiosRequestConfig} [requestConfig]
 */
export const updateTicketStatus = async (ticketId, status, requestConfig = {}) => {
  await ticketsApiClient.patch(`/tickets/${ticketId}/status`, { status }, requestConfig);
};

/**
 * Asigna un ticket a un usuario de soporte.
 *
 * @param {string} ticketId Identificador del ticket.
 * @param {string} userId Identificador del soporte asignado.
 * @param {import("axios").AxiosRequestConfig} [requestConfig]
 */
export const assignTicketToSupport = async (ticketId, userId, requestConfig = {}) => {
  await ticketsApiClient.patch(`/tickets/${ticketId}/assign`, {
    assigneeUserId: userId,
  }, requestConfig);
};

/**
 * Consulta usuarios filtrados por rol. Hoy se usa para listar soportes asignables.
 *
 * @param {string} role Rol solicitado al backend.
 * @param {import("axios").AxiosRequestConfig} [requestConfig]
 */
export const getUsersByRole = async (role, requestConfig = {}) => {
  const { data } = await usersApiClient.get("/users", {
    ...requestConfig,
    params: { role },
  });

  return data;
};

/**
 * Atajo semantico para la pantalla de asignacion de tickets.
 *
 * @param {import("axios").AxiosRequestConfig} [requestConfig]
 */
export const getSupportUsers = async (requestConfig = {}) =>
  getUsersByRole(ROLES.SUPPORT, requestConfig);
