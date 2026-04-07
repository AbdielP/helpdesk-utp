// Simula backend (reemplazar por fetch a .NET cuando haya API real)

export const login = async () => {
  return {
    token: "fake-jwt",
    user: {
      id: 1,
      role: "user", // cambiar para probar: admin, support, user
    },
  };
};

export const logout = () => {
    // uso de cookie para simular almacenamiento del token
  document.cookie = "token=; Max-Age=0; path=/;";
  document.cookie = "user=; Max-Age=0; path=/;";
};