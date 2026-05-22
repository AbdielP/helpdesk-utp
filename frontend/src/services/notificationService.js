import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import notificationsApiClient, { notificationsApiUrl } from "./notificationsApiClient";

export const getUserNotifications = async (userId, requestConfig = {}) => {
  const { data } = await notificationsApiClient.get(`/notifications/user/${userId}`, requestConfig);
  return data;
};

export const getUnreadCount = async (userId, requestConfig = {}) => {
  const { data } = await notificationsApiClient.get(
    `/notifications/user/${userId}/unread-count`,
    requestConfig,
  );

  return data.count;
};

export const markAllAsRead = async (userId, requestConfig = {}) => {
  await notificationsApiClient.patch(`/notifications/user/${userId}/read-all`, null, requestConfig);
};

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
