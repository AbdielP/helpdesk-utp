import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split("; ");

    const userCookie = cookies.find((cookie) => cookie.startsWith("user="));

    if (userCookie) {
      const parsedUser = JSON.parse(
        decodeURIComponent(userCookie.split("=")[1]),
      );
      setUser(parsedUser);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);

    document.cookie = `token=${res.token}; path=/;`;
    document.cookie = `user=${encodeURIComponent(JSON.stringify(res.user))}; path=/;`;

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
