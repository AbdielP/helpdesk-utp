import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("es-PA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoTableRow = ({ label, value, chips = null }) => (
  <TableRow>
    <TableCell
      sx={{
        width: { xs: "38%", md: 220 },
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.secondary",
        fontWeight: 600,
        fontSize: "0.85rem",
        py: 1.75,
      }}
    >
      {label}
    </TableCell>
    <TableCell
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 1.5,
      }}
    >
      {chips ? (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>{chips}</Box>
      ) : (
        <Typography sx={{ fontWeight: 500 }}>{value || "-"}</Typography>
      )}
    </TableCell>
  </TableRow>
);

const TicketDetailPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const inputFieldStyles = theme.custom.form.inputFieldStyles;

  const [ticket, setTicket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const allTickets =
      JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    const foundTicket = allTickets.find(
      (singleTicket) => singleTicket.id === Number(id),
    );
    setTicket(foundTicket);
  }, [id]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const supportTeamUsers = users.filter((user) => user.role === ROLES.SUPPORT);
  const assignedUser = users.find((user) => user.id === ticket?.assigned_to);
  const createdByUser = users.find((user) => user.id === ticket?.created_by);
  const isUserPrivileged =
    currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.SUPPORT;

  const updateTicket = (updatedFields) => {
    const allTickets =
      JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    const updatedAt = new Date().toISOString();

    const updatedTickets = allTickets.map((singleTicket) =>
      singleTicket.id === ticket.id
        ? {
            ...singleTicket,
            ...updatedFields,
            updated_at: updatedAt,
          }
        : singleTicket,
    );

    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(updatedTickets));
    setTicket((previousTicket) => ({
      ...previousTicket,
      ...updatedFields,
      updated_at: updatedAt,
    }));
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

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1040, mx: "auto" }}>
        <BackNavigationButton />

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
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                  }}
                >
                  Ticket #{ticket.id}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.25,
                    mt: 0.5,
                  }}
                >
                  {ticket.title}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TicketChip type="status" value={ticket.status} />
                <TicketChip type="priority" value={ticket.priority} />
              </Box>
            </Box>
          </Stack>
        </Paper>

        <Stack spacing={3}>
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
                Información del ticket
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Resumen general y datos principales del caso.
              </Typography>
            </Box>

            <Divider />

            <Table>
              <TableBody>
                <InfoTableRow label="Categoría" value={ticket.category} />
                <InfoTableRow
                  label="Estado y prioridad"
                  chips={[
                    <TicketChip key="status" type="status" value={ticket.status} />,
                    <TicketChip
                      key="priority"
                      type="priority"
                      value={ticket.priority}
                    />,
                  ]}
                />
                <InfoTableRow
                  label="Creado el"
                  value={formatDateTime(ticket.created_at)}
                />
                <InfoTableRow
                  label="Última actualización"
                  value={formatDateTime(ticket.updated_at || ticket.created_at)}
                />
                <InfoTableRow
                  label="Creado por"
                  value={createdByUser?.email || "Desconocido"}
                />
                <InfoTableRow
                  label="Asignado a"
                  value={assignedUser?.email || "Sin asignar"}
                />
              </TableBody>
            </Table>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              backgroundColor: "#FFFFFF",
              borderColor: "#DDDADF",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Descripción
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Detalle completo del ticket para lectura y seguimiento.
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={7}
              value={ticket.description || ""}
              InputProps={{ readOnly: true }}
              sx={inputFieldStyles}
            />
          </Paper>

          {isUserPrivileged && (
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: { xs: 2, md: 3 },
                backgroundColor: "#FFFFFF",
                borderColor: "#DDDADF",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Gestión del ticket
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Actualiza el estado del caso y, si corresponde, asigna un técnico.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 320px))" },
                  gap: 2,
                }}
              >
                {currentUser?.role === ROLES.ADMIN && (
                  <FormControl size="small" fullWidth>
                    <InputLabel>Asignar técnico</InputLabel>
                    <Select
                      label="Asignar técnico"
                      value={ticket.assigned_to ?? ""}
                      onChange={(event) => {
                        const nextAssignedTo =
                          event.target.value === "" ? null : Number(event.target.value);

                        updateTicket({ assigned_to: nextAssignedTo });
                        showNotification("Ticket asignado correctamente", "success");
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

                <FormControl size="small" fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    label="Estado"
                    value={ticket.status}
                    onChange={(event) => {
                      updateTicket({ status: event.target.value });
                      showNotification(
                        `Estado actualizado a ${event.target.value}`,
                        "success",
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
            </Paper>
          )}
        </Stack>

        <Box sx={{ height: { xs: 40, md: 56 } }} />
      </Box>
    </Box>
  );
};

export default TicketDetailPage;
