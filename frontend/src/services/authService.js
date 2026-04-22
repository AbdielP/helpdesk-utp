import apiClient from "./apiClient";
import { AUTH_ERRORS, STORAGE_KEYS } from "../constants/constants";

const getCookieValue = (key) => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${key}=`));

  if (!cookie) {
    return null;
  }

  return cookie.split("=").slice(1).join("=");
};

const createAuthError = (message) => {
  const error = new Error(message);
  error.code = message;
  return error;
};

export const login = async (email, password) => {
  try {
    const { data } = await apiClient.post("/auth/login", {
      email,
      password,
    });

    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw createAuthError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    throw createAuthError(AUTH_ERRORS.NETWORK_ERROR);
  }
};

export const persistSession = ({ token, user }) => {
  document.cookie = `${STORAGE_KEYS.TOKEN}=${encodeURIComponent(token)}; path=/;`;
  document.cookie = `${STORAGE_KEYS.USER}=${encodeURIComponent(
    JSON.stringify(user),
  )}; path=/;`;
};

export const clearSession = () => {
  document.cookie = `${STORAGE_KEYS.TOKEN}=; Max-Age=0; path=/;`;
  document.cookie = `${STORAGE_KEYS.USER}=; Max-Age=0; path=/;`;
};

export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    clearSession();
  }
};

export const getCurrentUser = () => {
  const rawUser = getCookieValue(STORAGE_KEYS.USER);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(rawUser));
  } catch {
    clearSession();
    return null;
  }
};
