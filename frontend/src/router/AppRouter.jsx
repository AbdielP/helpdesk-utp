import { Routes, Route } from "react-router-dom";

import LoginPage from "../Pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import DashboardPage from "../Pages/DashboardPage";
import CreateTicketPage from "../Pages/CreateTicketPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ticket/:id" element={<div>Ticket details</div>} />
          <Route path="/ticket/new" element={<CreateTicketPage />} />

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<div>Admin</div>} />
          </Route>

          <Route path="*" element={<div>Not found</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
