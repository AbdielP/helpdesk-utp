import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";
import { STORAGE_KEYS } from "../constants/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split("; ");

    const userCookie = cookies.find((cookie) =>
      cookie.startsWith(`${STORAGE_KEYS.USER}=`),
    );

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

    document.cookie = `${STORAGE_KEYS.TOKEN}=${res.token}; path=/;`;
    document.cookie = `${STORAGE_KEYS.USER}=${encodeURIComponent(
      JSON.stringify(res.user),
    )}; path=/;`;

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
