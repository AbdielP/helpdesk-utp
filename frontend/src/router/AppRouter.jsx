import { Routes, Route, useLocation } from "react-router-dom";
import { DashboardPage } from "../Pages/DashboardPage";
import { Topbar } from '../components/Topbar';
import LoginPage from "../Pages/LoginPage";

const AppRouter = () => {
  const location = useLocation();
  const showTopbar = location.pathname !== "/login";

  return (
    <>
      {showTopbar && <Topbar />}
      <Routes>
        <Route path="/login" element={
          <LoginPage />
        } />
        <Route path="/" element={
          <DashboardPage />
        } />
        <Route path="/tickets" element={<div>Tickets</div>} />
        <Route path="/tickets/new" element={<div>New Ticket</div>} />
        <Route path="/admin" element={<div>Admin</div>} />
      </Routes>
    </>
  );
}

export default AppRouter;
