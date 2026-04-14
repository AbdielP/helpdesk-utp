import { Routes, Route } from "react-router-dom";

import LoginPage from "../Pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import DashboardPage from "../Pages/DashboardPage";
import CreateTicketPage from "../Pages/CreateTicketPage";
import TicketDetailPage from "../Pages/TicketDetailPage";
import { ROUTES, ROLES } from "../constants/constants";

const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<DashboardPage />} />
          <Route path={ROUTES.TICKET_DETAIL} element={<TicketDetailPage />} />
          <Route path={ROUTES.TICKET_NEW} element={<CreateTicketPage />} />

          <Route path="*" element={<div>Not found</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
