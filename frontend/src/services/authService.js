import usersApiClient from "./usersApiClient";
import { AUTH_ERRORS } from "../constants/constants";

const LEGACY_AUTH_STORAGE_KEYS = ["token", "user"];

/**
 * Borra restos de la autenticacion anterior basada en storage.
 * La sesion actual vive en cookie HttpOnly, asi que esos valores ya no deben decidir permisos.
 */
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

/**
 * Abre sesion contra Users API. Si el login funciona, el backend deja la cookie de sesion.
 *
 * @param {string} email Correo del usuario.
 * @param {string} password Contrasena ingresada.
 * @param {Object} [requestConfig]
 * @returns {Promise<{ user: object }>} Perfil basico devuelto por la API.
 */
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

/**
 * Cierra sesion en el servidor y limpia cualquier estado local viejo aunque la API no responda.
 *
 * @param {Object} [requestConfig]
 */
export const logout = async (requestConfig = {}) => {
  try {
    await usersApiClient.post("/users/logout", null, requestConfig);
  } catch {
    // Logout should clear client state even if the API is temporarily unavailable.
  } finally {
    clearLegacyClientSession();
  }
};

/**
 * Pregunta al backend si la cookie actual todavia representa una sesion valida.
 * Devuelve null para que la UI pueda mandar al login sin mostrar errores tecnicos.
 */
export const refreshSession = async () => {
  clearLegacyClientSession();

  try {
    const { data } = await usersApiClient.get("/users/me");
    return data;
  } catch {
    return null;
  }
};
