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

export const STATUS_ORDER = {
  Abierto: 1,
  "En proceso": 2,
  Cerrado: 3,
};

export const TICKET_CATEGORIES = ["Red", "Plataforma", "Cuenta", "Hardware"];
export const TICKET_PRIORITIES = ["Baja", "Media", "Alta"];
export const TICKET_STATUSES = ["Abierto", "En proceso", "Cerrado"];

// Configuración de prioridades para MUI (props + colores)
export const PRIORITY_CONFIG = {
  Alta: { color: "error", label: "Alta" },
  Media: { color: "warning", label: "Media" },
  Baja: { color: "success", label: "Baja" },
};

// Configuración de estados para MUI (props + colores)
export const STATUS_CONFIG = {
  Abierto: { color: "warning", label: "Abierto" },
  "En proceso": { color: "info", label: "En proceso" },
  Cerrado: { color: "success", label: "Cerrado" },
};

// Colores custom para chips de prioridad en formularios
export const PRIORITY_CUSTOM_COLORS = {
  Alta: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
  Media: { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
  Baja: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
};

export { DRAWER_WIDTH };