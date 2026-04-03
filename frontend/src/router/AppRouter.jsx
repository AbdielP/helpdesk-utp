import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import LoginPage from "../Pages/LoginPage";
import DashboardPage from "../Pages/DashboardPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas con layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tickets" element={<div>Tickets</div>} />
        <Route path="/tickets/new" element={<div>New Ticket</div>} />
        <Route path="/admin" element={<div>Admin</div>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
