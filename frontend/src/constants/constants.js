const DRAWER_WIDTH = 240;

export const ROLES = {
  USER: "user",
  SUPPORT: "support",
  ADMIN: "admin",
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  NETWORK_ERROR: "NETWORK_ERROR",
};

export const ERROR_MESSAGES = {
  [AUTH_ERRORS.INVALID_CREDENTIALS]: "Credenciales invalidas",
  [AUTH_ERRORS.NETWORK_ERROR]: "No se pudo conectar con el servidor",
  GENERIC: "Error inesperado",
  NO_SESSION_USER: "No hay usuario en sesion",
  TICKET_NOT_FOUND: "No se encontro el ticket",
};

export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  TICKET_NEW: "/ticket/new",
  TICKET_DETAIL: "/ticket/:id",
};

export const STATUS_ORDER = {
  Abierto: 1,
  "En proceso": 2,
  Cerrado: 3,
};

export const TICKET_CATEGORIES = ["Red", "Plataforma", "Cuenta", "Hardware"];
export const TICKET_PRIORITIES = ["Baja", "Media", "Alta"];
export const TICKET_STATUSES = ["Abierto", "En proceso", "Cerrado"];

// Configuracion de estados para MUI (props + colores)
export const STATUS_CONFIG = {
  Abierto: { color: "warning", label: "Abierto" },
  "En proceso": { color: "info", label: "En proceso" },
  Cerrado: { color: "success", label: "Cerrado" },
};

export { DRAWER_WIDTH };
