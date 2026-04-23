import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ERROR_MESSAGES, ROLES, TICKET_STATUSES } from "../constants/constants";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../shared/NotificationProvider";
import BackNavigationButton from "../shared/BackNavigationButton";
import TicketChip from "../shared/TicketChip";
import {
  assignTicketToSupport,
  getKnownUsers,
  getSupportUsers,
  getTicketByRole,
  updateTicketStatusByRole,
} from "../services/ticketService";

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

const getAssignmentEvent = (history = []) =>
  [...history]
    .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
    .find((entry) => entry.action?.startsWith("Ticket asignado"));

const TicketDetailPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const inputFieldStyles = theme.custom.form.inputFieldStyles;
  const { user: currentUser } = useAuth();
  const { showNotification } = useNotification();

  const [ticket, setTicket] = useState(null);
  const [supportUsers, setSupportUsers] = useState([]);
  const [knownUsers, setKnownUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadTicketDetail = async () => {
    if (!currentUser?.id || !id) {
      return;
    }

    try {
      setIsLoading(true);

      const requests = [
        getTicketByRole(currentUser.role, id, currentUser.id),
        getKnownUsers().catch(() => []),
      ];

      if (currentUser.role === ROLES.ADMIN) {
        requests.push(getSupportUsers().catch(() => []));
      }

      const [fetchedTicket, users = [], adminSupportUsers = []] = await Promise.all(
        requests,
      );

      setTicket(fetchedTicket);
      setKnownUsers(users);
      setSupportUsers(adminSupportUsers);
    } catch {
      setTicket(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTicketDetail();
  }, [currentUser, id]);

  const knownUsersById = useMemo(
    () =>
      new Map(
        knownUsers.map((knownUser) => [knownUser.id, knownUser]),
      ),
    [knownUsers],
  );

  const assignedUser = ticket?.assigned_to
    ? knownUsersById.get(ticket.assigned_to)
    : null;
  const createdByUser = ticket?.created_by
    ? knownUsersById.get(ticket.created_by)
    : null;
  const assignmentEvent = getAssignmentEvent(ticket?.history);
  const historyItems = [...(ticket?.history ?? [])].sort(
    (left, right) => new Date(right.created_at) - new Date(left.created_at),
  );

  const isUserPrivileged =
    currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.SUPPORT;

  const handleStatusChange = async (nextStatus) => {
    if (!ticket || !currentUser) {
      return;
    }

    try {
      setIsSaving(true);
      await updateTicketStatusByRole(
        currentUser.role,
        ticket.id,
        nextStatus,
        currentUser.id,
      );
      await loadTicketDetail();
      showNotification(`Estado actualizado a ${nextStatus}`, "success");
    } catch {
      showNotification(ERROR_MESSAGES.GENERIC, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssignChange = async (nextAssignedTo) => {
    if (!ticket || !currentUser) {
      return;
    }

    try {
      setIsSaving(true);
      await assignTicketToSupport(ticket.id, nextAssignedTo, currentUser.id);
      await loadTicketDetail();
      showNotification("Ticket asignado correctamente", "success");
    } catch {
      showNotification(ERROR_MESSAGES.GENERIC, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

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
                Informacion del ticket
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Resumen general y datos principales del caso.
              </Typography>
            </Box>

            <Divider />

            <Table>
              <TableBody>
                <InfoTableRow label="Categoria" value={ticket.category} />
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
                  label="Ultima actualizacion"
                  value={formatDateTime(ticket.updated_at || ticket.created_at)}
                />
                {currentUser?.role !== ROLES.USER && (
                  <InfoTableRow
                    label="Fecha de asignacion"
                    value={formatDateTime(assignmentEvent?.created_at)}
                  />
                )}
                {currentUser?.role !== ROLES.USER && (
                  <InfoTableRow
                    label="Creado por"
                    value={createdByUser?.email || ticket.created_by}
                  />
                )}
                {currentUser?.role !== ROLES.USER && (
                  <InfoTableRow
                    label="Asignado a"
                    value={assignedUser?.email || (ticket.assigned_to ?? "Sin asignar")}
                  />
                )}
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
              Descripcion
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
              Historial del ticket
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Registro de fecha, usuario y accion realizada sobre el caso.
            </Typography>

            <Stack spacing={1.5}>
              {historyItems.length > 0 ? (
                historyItems.map((entry) => (
                  <Box
                    key={entry.id}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {entry.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {formatDateTime(entry.created_at)} |{" "}
                      {knownUsersById.get(entry.user_id)?.email || entry.user_id}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  No hay eventos registrados todavia.
                </Typography>
              )}
            </Stack>
          </Paper>

          {isUserPrivileged && currentUser?.role !== ROLES.USER && (
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
                Gestion del ticket
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Actualiza el estado del caso y, si corresponde, asigna un tecnico.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 320px))" },
                  gap: 2,
                }}
              >
                {currentUser?.role === ROLES.ADMIN && (
                  <FormControl size="small" fullWidth disabled={isSaving}>
                    <InputLabel>Asignar tecnico</InputLabel>
                    <Select
                      label="Asignar tecnico"
                      value={ticket.assigned_to ?? ""}
                      onChange={(event) => {
                        const nextAssignedTo = event.target.value;
                        handleAssignChange(nextAssignedTo);
                      }}
                    >
                      {supportUsers.map((supportUser) => (
                        <MenuItem key={supportUser.id} value={supportUser.id}>
                          {supportUser.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <FormControl size="small" fullWidth disabled={isSaving}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    label="Estado"
                    value={ticket.status}
                    onChange={(event) => {
                      handleStatusChange(event.target.value);
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
