import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage } from "../Pages/DashboardPage";

const AppRouter = () => {
  return (

    // !!!!! COMPONENTES PENDIENTES POR CREAR

    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/" element={
          <DashboardPage />
        } />
        <Route path="/tickets" element={<div>Tickets</div>} />
        <Route path="/tickets/new" element={<div>New Ticket</div>} />
        <Route path="/admin" element={<div>Admin</div>} />
      </Routes>
    </BrowserRouter>

    // TODO:
    // 1) Navegacion
    // 2) Rutas protegidas
    // 3) Navbar y header
    // 4) Estilos css basicos (margin, fontsize, color, etc)
  );
}

export default AppRouter;