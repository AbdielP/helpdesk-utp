import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");

    if (hasToken) {
      setUser({
        id: 1,
        role: "admin",
      });
    }

    setLoading(false);
  }, []);

  const login = async () => {
    const res = await authService.login();

    // guarda token en cookie
    document.cookie = `token=${res.token}; path=/;`;

    setUser(res.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
