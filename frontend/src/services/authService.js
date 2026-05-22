import usersApiClient from "./usersApiClient";
import { AUTH_ERRORS } from "../constants/constants";

const LEGACY_AUTH_STORAGE_KEYS = ["token", "user"];

export const clearLegacyClientSession = () => {
  LEGACY_AUTH_STORAGE_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};

const createAuthError = (message) => {
  const error = new Error(message);
  error.code = message;
  return error;
};

export const login = async (email, password, requestConfig = {}) => {
  try {
    clearLegacyClientSession();

    const { data } = await usersApiClient.post("/users/login", {
      email,
      password,
    }, requestConfig);

    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw createAuthError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    throw createAuthError(AUTH_ERRORS.NETWORK_ERROR);
  }
};

export const logout = async (requestConfig = {}) => {
  try {
    await usersApiClient.post("/users/logout", null, requestConfig);
  } catch {
    // Logout should clear client state even if the API is temporarily unavailable.
  } finally {
    clearLegacyClientSession();
  }
};

export const refreshSession = async () => {
  clearLegacyClientSession();

  try {
    const { data } = await usersApiClient.get("/users/me");
    return data;
  } catch {
    return null;
  }
};
