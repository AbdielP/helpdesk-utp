import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

// Este componente se encarga de envolver las páginas que necesitan el layout con sidebar y topbar. El Outlet es donde se renderizarán las páginas hijas (Dashboard, Tickets, etc).
const Layout = () => {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

export default Layout;