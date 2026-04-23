import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import TicketsTable from "../components/TicketsTable";
import { ERROR_MESSAGES, ROLES, STATUS_ORDER } from "../constants/constants";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../shared/NotificationProvider";
import { getSupportUsers, getTicketsByRole } from "../services/ticketService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [tickets, setTickets] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    const loadDashboard = async () => {
      try {
        setIsLoading(true);

        const fetchedTickets = await getTicketsByRole(user.role);
        setTickets(fetchedTickets);

        if (user.role === ROLES.ADMIN) {
          const fetchedSupportUsers = await getSupportUsers();
          setSupportUsers(fetchedSupportUsers);
        } else {
          setSupportUsers([]);
        }
      } catch {
        showNotification(ERROR_MESSAGES.GENERIC, "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [showNotification, user]);

  const filtered = useMemo(() => {
    if (!user) {
      return [];
    }

    let result = [];

    if (user.role === ROLES.USER) {
      result = tickets.filter((ticket) => ticket.created_by === user.id);
    } else if (user.role === ROLES.SUPPORT) {
      result = tickets.filter((ticket) => ticket.assigned_to === user.id);
    } else if (user.role === ROLES.ADMIN) {
      result = tickets;
    }

    return [...result].sort(
      (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
    );
  }, [tickets, user]);

  const dashboardCopy = useMemo(() => {
    if (!user) {
      return {
        title: "Dashboard",
        description: "Vista general de tickets y seguimiento.",
      };
    }

    if (user.role === ROLES.USER) {
      return {
        title: "Mis tickets",
        description:
          "Consulta el estado de tus solicitudes y entra a cada ticket para revisar su detalle.",
      };
    }

    if (user.role === ROLES.SUPPORT) {
      return {
        title: "Tickets asignados",
        description:
          "Revisa los casos que tienes a cargo y manten actualizado su progreso.",
      };
    }

    return {
      title: "Panel general",
      description:
        "Supervisa todos los tickets del sistema y detecta rapidamente la carga operativa.",
    };
  }, [user]);

  const stats = useMemo(
    () => [
      {
        label: "Total",
        value: filtered.length,
        tone: theme.palette.primary.main,
      },
      {
        label: "Abiertos",
        value: filtered.filter((ticket) => ticket.status === "Abierto").length,
        tone: theme.palette.info.main,
      },
      {
        label: "En proceso",
        value: filtered.filter((ticket) => ticket.status === "En proceso").length,
        tone: theme.palette.warning.main,
      },
      {
        label: "Cerrados",
        value: filtered.filter((ticket) => ticket.status === "Cerrado").length,
        tone: theme.palette.success.main,
      },
    ],
    [filtered, theme],
  );

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: { xs: 2.5, md: 3 },
            backgroundColor: theme.palette.background.paper,
            borderColor: "#DDDADF",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
            {dashboardCopy.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {dashboardCopy.description}
          </Typography>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {stats.map((stat) => (
            <Paper
              key={stat.label}
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: 2,
                backgroundColor: "#FFFFFF",
                borderColor: "#DDDADF",
              }}
            >
              <Stack spacing={0.75}>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: stat.tone, lineHeight: 1 }}
                >
                  {stat.value}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            borderColor: "#DDDADF",
          }}
        >
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Listado de tickets
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Ordena por columnas y entra en cada fila para ver el detalle completo.
            </Typography>
          </Box>

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TicketsTable
              tickets={filtered}
              user={user}
              supportUsers={supportUsers}
              onRowClick={(ticketId) => navigate(`/ticket/${ticketId}`)}
            />
          )}
        </Paper>

        <Box sx={{ height: { xs: 40, md: 56 } }} />
      </Box>
    </Box>
  );
};

export default DashboardPage;
