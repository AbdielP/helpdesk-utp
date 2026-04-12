import { users } from '../mocks/users';
import { AUTH_ERRORS, STORAGE_KEYS } from '../constants/constants';

// Simula backend (reemplazar por fetch a .NET cuando haya API real)
export const login = async (email, password) => {
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
  }

  if (user.password !== password) {
    throw new Error(AUTH_ERRORS.INVALID_PASSWORD);
  }

  return {
    token: 'fake-token',
    user,
  };
};

export const logout = () => {
  // uso de cookie para simular almacenamiento del token
  document.cookie = `${STORAGE_KEYS.TOKEN}=; Max-Age=0; path=/;`;
  document.cookie = `${STORAGE_KEYS.USER}=; Max-Age=0; path=/;`;
};

// Temporal para obtener el usuario desde la cookie (reemplazar por lógica real cuando haya API)
export const getCurrentUser = () => {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${STORAGE_KEYS.USER}=`));

  if (!cookie) return null;

  return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
};