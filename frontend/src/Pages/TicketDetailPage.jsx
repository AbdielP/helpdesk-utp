import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { getCurrentUser } from "../services/authService";
import { users } from "../mocks/users";
import {
  ERROR_MESSAGES,
  ROLES,
  STORAGE_KEYS,
  TICKET_STATUSES,
} from "../constants/constants";
import { useNotification } from "../shared/NotificationProvider";
import BackNavigationButton from "../shared/BackNavigationButton";
import TicketChip from "../shared/TicketChip";
import MetaInfoItem from "../shared/MetaInfoItem";

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { showNotification } = useNotification();

  // Load ticket from storage
  useEffect(() => {
    const allTickets = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    const foundTicket = allTickets.find((singleTicket) => singleTicket.id === Number(id));
    setTicket(foundTicket);
  }, [id]);

  // Load current user
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const supportTeamUsers = users.filter((user) => user.role === ROLES.SUPPORT);
  const assignedUser = users.find((user) => user.id === ticket?.assigned_to);
  const createdByUser = users.find((user) => user.id === ticket?.created_by);

  const updateTicket = (updatedFields) => {
    const allTickets = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    const updatedTickets = allTickets.map((singleTicket) =>
      singleTicket.id === ticket.id
        ? {
            ...singleTicket,
            ...updatedFields,
            updated_at: new Date().toISOString(),
          }
        : singleTicket
    );
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(updatedTickets));
    setTicket((previousTicket) => ({ ...previousTicket, ...updatedFields }));
  };

  if (!ticket) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <Typography color="text.secondary">
          {ERROR_MESSAGES.TICKET_NOT_FOUND}
        </Typography>
      </Box>
    );
  }

  const isUserPrivileged =
    currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.SUPPORT;

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 4,
        px: 3,
        pb: 6,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 780 }}>
        <BackNavigationButton />

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontWeight: 600, letterSpacing: 0.5 }}
            >
              #{ticket.id}
            </Typography>
            <TicketChip type="status" value={ticket.status} />
            <TicketChip type="priority" value={ticket.priority} variant="outlined" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {ticket.title}
          </Typography>
        </Box>

        {/* Main Content Card */}
        <Paper
          variant="outlined"
          sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}
        >
          {/* Description */}
          <Box sx={{ px: 3, py: 2.5 }}>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{
                textTransform: "uppercase",
                letterSpacing: 0.5,
                fontWeight: 600,
              }}
            >
              Descripción
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 0.75, color: "text.primary", lineHeight: 1.7 }}
            >
              {ticket.description}
            </Typography>
          </Box>

          <Divider />

          {/* Metadata Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
              px: 3,
              py: 2.5,
              gap: 3,
            }}
          >
            <MetaInfoItem Icon={CategoryOutlinedIcon} label="Categoría">
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {ticket.category}
              </Typography>
            </MetaInfoItem>

            <MetaInfoItem Icon={PriorityHighIcon} label="Prioridad">
              <TicketChip type="priority" value={ticket.priority} />
            </MetaInfoItem>

            <MetaInfoItem Icon={AccessTimeOutlinedIcon} label="Creado">
              <Typography variant="body2" color="text.secondary">
                {new Date(ticket.created_at).toLocaleString("es-PA", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </MetaInfoItem>

            {isUserPrivileged && (
              <MetaInfoItem Icon={PersonOutlineIcon} label="Creado por">
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {createdByUser?.email ?? "Desconocido"}
                </Typography>
              </MetaInfoItem>
            )}
          </Box>

          {/* Assignment Info (privileged users only) */}
          {isUserPrivileged && (
            <>
              <Divider />
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <AssignmentIndOutlinedIcon
                  sx={{ fontSize: 18, color: "text.disabled" }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 80 }}
                >
                  Asignado a
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {assignedUser?.email ?? "Sin asignar"}
                </Typography>
              </Box>
            </>
          )}
        </Paper>

        {/* Actions Section (privileged users only) */}
        {isUserPrivileged && (
          <Box>
            <Typography
              variant="overline"
              color="text.disabled"
              sx={{ mb: 1.5, display: "block" }}
            >
              Acciones
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {currentUser?.role === ROLES.ADMIN && (
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Asignar técnico</InputLabel>
                  <Select
                    label="Asignar técnico"
                    value={ticket.assigned_to ?? ""}
                    onChange={(event) => {
                      updateTicket({ assigned_to: Number(event.target.value) });
                      showNotification(
                        "Ticket asignado correctamente",
                        "success"
                      );
                    }}
                  >
                    <MenuItem value="">
                      <em>Sin asignar</em>
                    </MenuItem>
                    {supportTeamUsers.map((supportUser) => (
                      <MenuItem key={supportUser.id} value={supportUser.id}>
                        {supportUser.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  value={ticket.status}
                  onChange={(event) => {
                    updateTicket({ status: event.target.value });
                    showNotification(
                      `Estado actualizado a ${event.target.value}`,
                      "success"
                    );
                  }}
                >
                  {TICKET_STATUSES.map((statusOption) => (
                    <MenuItem key={statusOption} value={statusOption}>
                      {statusOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TicketDetailPage;
