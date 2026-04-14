const DRAWER_WIDTH = 240;

export const ROLES = {
  USER: "user",
  SUPPORT: "support",
  ADMIN: "admin",
};

export const AUTH_ERRORS = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_PASSWORD: "INVALID_PASSWORD",
};

export const ERROR_MESSAGES = {
  [AUTH_ERRORS.USER_NOT_FOUND]: "Usuario no existe",
  [AUTH_ERRORS.INVALID_PASSWORD]: "Contraseña incorrecta",
  GENERIC: "Error inesperado",
  NO_SESSION_USER: "No hay usuario en sesión",
  TICKET_NOT_FOUND: "No se encontró el ticket",
};

export const STORAGE_KEYS = {
  TICKETS: "tickets",
  USER: "user",
  TOKEN: "token",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  TICKET_NEW: "/ticket/new",
  TICKET_DETAIL: "/ticket/:id"
};

export const TICKET_CATEGORIES = ["Red", "Plataforma", "Cuenta", "Hardware"];
export const TICKET_PRIORITIES = ["Baja", "Media", "Alta"];
export const TICKET_STATUSES = ["Abierto", "En proceso", "Cerrado"];

export { DRAWER_WIDTH };