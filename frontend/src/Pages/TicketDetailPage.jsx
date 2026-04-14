import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getCurrentUser } from "../services/authService";
import { users } from "../mocks/users";
import {
  ERROR_MESSAGES,
  ROLES,
  STORAGE_KEYS,
  TICKET_STATUSES,
} from "../constants/constants";

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);

  // cargar ticket
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    const found = data.find((t) => t.id === Number(id));
    setTicket(found);
  }, [id]);

  // usuario actual
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // técnicos
  const supportUsers = users.filter((u) => u.role === ROLES.SUPPORT);

  // actualizar ticket en localStorage
  const updateTicket = (updatedFields) => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];

    const updated = data.map((t) =>
      t.id === ticket.id
        ? { ...t, ...updatedFields, updated_at: new Date().toISOString() }
        : t,
    );

    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(updated));
    setTicket((prev) => ({ ...prev, ...updatedFields }));
  };

  if (!ticket) {
    return <Typography>{ERROR_MESSAGES.TICKET_NOT_FOUND}</Typography>;
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 3,
        px: 2,
      }}
    >
      <Paper sx={{ p: 3, width: "100%", maxWidth: 800 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {ticket.title}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Descripción:</strong> {ticket.description}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Categoría:</strong> {ticket.category}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Prioridad:</strong> {ticket.priority}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Estado:</strong> {ticket.status}
        </Typography>

        <Typography color="text.secondary">
          {new Date(ticket.created_at).toLocaleString()}
        </Typography>

        {/* CONTROLES */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          {/* ADMIN → asignar */}
          {user?.role === ROLES.ADMIN && (
            <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel>Asignar a técnico</InputLabel>
              <Select
                label="Asignar a técnico"
                value={ticket.assigned_to || ""}
                onChange={(e) =>
                  updateTicket({ assigned_to: Number(e.target.value) })
                }
              >
                <MenuItem value="">
                  <em>Sin asignar</em>
                </MenuItem>

                {supportUsers.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* ADMIN + SUPPORT → estado */}
          {(user?.role === ROLES.ADMIN || user?.role === ROLES.SUPPORT) && (
            <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                value={ticket.status}
                onChange={(e) => updateTicket({ status: e.target.value })}
              >
                {TICKET_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketDetailPage;
