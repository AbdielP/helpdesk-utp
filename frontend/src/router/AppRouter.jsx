import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage } from "../Pages/DashboardPage";
import { Topbar } from '../components/Topbar';

const AppRouter = () => {
  return (

    // !!!!! COMPONENTES PENDIENTES POR CREAR

    <BrowserRouter>
      <Topbar/>
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
    // 0) Crear pages y componentes faltantes
    // 1) Navegacion (en navbar y/o header)
    // 2) Rutas protegidas (todas menos login)
    // 3) Diseñar Navbar y header (visible en todas las paginas menos en login)
    // 4) Estilos css basicos (margin, fontsize, color, etc)
  );
}

export default AppRouter;