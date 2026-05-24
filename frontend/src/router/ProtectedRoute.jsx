import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/constants";

/**
 * Protege rutas que necesitan sesion y, opcionalmente, un conjunto de roles permitidos.
 */
const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Aqui se puede aplicar spinner o alguna indicación de carga
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
