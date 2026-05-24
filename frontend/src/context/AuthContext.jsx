import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

/**
 * Mantiene la sesion de la app en memoria a partir de la cookie HttpOnly del backend.
 * Al montar, valida la sesion con `/users/me` para evitar confiar en datos guardados en el navegador.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const currentUser = await authService.refreshSession();
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password, requestConfig) => {
    const res = await authService.login(email, password, requestConfig);

    setUser(res.user);
  };
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Acceso centralizado al usuario actual y acciones de login/logout.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
