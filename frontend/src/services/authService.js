import { users } from '../mocks/users';

// Simula backend (reemplazar por fetch a .NET cuando haya API real)
export const login = async (email, password) => {
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  if (user.password !== password) {
    throw new Error('INVALID_PASSWORD');
  }

  return {
    token: 'fake-token',
    user
  };
};

export const logout = () => {
  // uso de cookie para simular almacenamiento del token
  document.cookie = "token=; Max-Age=0; path=/;";
  document.cookie = "user=; Max-Age=0; path=/;";
};

// Temporal para obtener el usuario desde la cookie (reemplazar por lógica real cuando haya API)
export const getCurrentUser = () => {
  const cookie = document.cookie
    .split("; ")
    .find(c => c.startsWith("user="))

  if (!cookie) return null

  return JSON.parse(decodeURIComponent(cookie.split("=")[1]))
}