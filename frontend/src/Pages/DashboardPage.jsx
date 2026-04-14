import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { ROLES, STORAGE_KEYS } from "../constants/constants";
import TicketsTable from "../components/TicketsTable";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [user, setUser] = useState(null);

  // Obtener usuario desde cookie
  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
  }, []);

  // Obtener tickets desde localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    setTickets(data);
  }, []);

  // Filtrar según rol
  useEffect(() => {
    if (!user) return;

    let result = [];

    if (user.role === ROLES.USER) {
      result = tickets.filter((t) => t.created_by === user.id);
    } else if (user.role === ROLES.SUPPORT) {
      result = tickets.filter((t) => t.assigned_to === user.id);
    } else if (user.role === ROLES.ADMIN) {
      result = tickets;
    }

    setFiltered(result);
  }, [tickets, user]);

  return (
    <Box sx={{ height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}>
      {/* <Typography variant="h5" sx={{ mb: 2 }}>
        {user?.role === ROLES.USER && "Mis Tickets"}
        {user?.role === ROLES.SUPPORT && "Tickets Asignados"}
        {user?.role === ROLES.ADMIN && "Todos los Tickets"}
      </Typography> */}

      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <TicketsTable tickets={filtered} user={user} onRowClick={(ticketId) => navigate(`/ticket/${ticketId}`)}/>
      </Box>
    </Box>
  );
};

export default DashboardPage;
