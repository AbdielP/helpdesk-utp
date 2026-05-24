import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import notificationsApiClient, { notificationsApiUrl } from "./notificationsApiClient";

/**
 * Carga las ultimas notificaciones visibles para el usuario autenticado.
 *
 * @param {string} userId Identificador del usuario dueño de las notificaciones.
 * @param {Object} [requestConfig]
 */
export const getUserNotifications = async (userId, requestConfig = {}) => {
  const { data } = await notificationsApiClient.get(`/notifications/user/${userId}`, requestConfig);
  return data;
};

/**
 * Consulta el contador que alimenta el badge de la campana.
 *
 * @param {string} userId Identificador del usuario autenticado.
 * @param {Object} [requestConfig]
 */
export const getUnreadCount = async (userId, requestConfig = {}) => {
  const { data } = await notificationsApiClient.get(
    `/notifications/user/${userId}/unread-count`,
    requestConfig,
  );

  return data.count;
};

/**
 * Marca todas las notificaciones como leidas para sincronizar menu y contador.
 *
 * @param {string} userId Identificador del usuario autenticado.
 * @param {Object} [requestConfig]
 */
export const markAllAsRead = async (userId, requestConfig = {}) => {
  await notificationsApiClient.patch(`/notifications/user/${userId}/read-all`, null, requestConfig);
};

/**
 * Crea la conexion SignalR que escucha notificaciones nuevas y cambios del contador.
 *
 * @param {string} userId Identificador del usuario conectado.
 * @returns {Object} Conexion SignalR lista para iniciar.
 */
export const createNotificationsConnection = (userId) => {
  const hubUrl = `${notificationsApiUrl.replace(/\/$/, "")}/hubs/notifications`;

  return new HubConnectionBuilder()
    .withUrl(hubUrl, {
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
};
