import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { users } from "../mocks/users";
import {
  ERROR_MESSAGES,
  ROLES,
  STORAGE_KEYS,
  TICKET_STATUSES,
} from "../constants/constants";
import { useNotification } from "../shared/NotificationProvider";
import BackNavigationButton from "../shared/BackNavigationButton";

const PRIORITY_CONFIG = {
  Alta: { color: "error", label: "Alta" },
  Media: { color: "warning", label: "Media" },
  Baja: { color: "success", label: "Baja" },
};

const STATUS_CONFIG = {
  Abierto: { color: "warning", label: "Abierto" },
  "En proceso": { color: "info", label: "En proceso" },
  Cerrado: { color: "success", label: "Cerrado" },
};

const MetaItem = ({ icon: Icon, label, children }) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
      <Icon sx={{ fontSize: 15, color: "text.disabled" }} />
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}
      >
        {label}
      </Typography>
    </Box>
    {children}
  </Box>
);

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    const found = data.find((t) => t.id === Number(id));
    setTicket(found);
  }, [id]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const supportUsers = users.filter((u) => u.role === ROLES.SUPPORT);
  const assignedUser = users.find((u) => u.id === ticket?.assigned_to);
  const createdByUser = users.find((u) => u.id === ticket?.created_by);

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
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <Typography color="text.secondary">
          {ERROR_MESSAGES.TICKET_NOT_FOUND}
        </Typography>
      </Box>
    );
  }

  const priorityCfg = PRIORITY_CONFIG[ticket.priority] ?? { color: "default" };
  const statusCfg = STATUS_CONFIG[ticket.status] ?? { color: "default" };
  const isPrivileged =
    user?.role === ROLES.ADMIN || user?.role === ROLES.SUPPORT;

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
        {/* BTN VOLVER */}
        <BackNavigationButton />
        
        {/* ── HEADER ─────────────────────────────────────────── */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontWeight: 600, letterSpacing: 0.5 }}
            >
              #{ticket.id}
            </Typography>
            <Chip
              label={statusCfg.label ?? ticket.status}
              size="small"
              color={statusCfg.color}
              sx={{ fontWeight: 600, borderRadius: 1 }}
            />
            <Chip
              label={priorityCfg.label ?? ticket.priority}
              size="small"
              color={priorityCfg.color}
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: 1 }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {ticket.title}
          </Typography>
        </Box>

        {/* ── MAIN CARD ──────────────────────────────────────── */}
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

          {/* Meta grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
              px: 3,
              py: 2.5,
              gap: 3,
            }}
          >
            <MetaItem icon={CategoryOutlinedIcon} label="Categoría">
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {ticket.category}
              </Typography>
            </MetaItem>

            <MetaItem icon={PriorityHighIcon} label="Prioridad">
              <Chip
                label={ticket.priority}
                size="small"
                color={priorityCfg.color}
                sx={{ fontWeight: 600, borderRadius: 1 }}
              />
            </MetaItem>

            <MetaItem icon={AccessTimeOutlinedIcon} label="Creado">
              <Typography variant="body2" color="text.secondary">
                {new Date(ticket.created_at).toLocaleString("es-PA", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </MetaItem>

            {isPrivileged && (
              <MetaItem icon={PersonOutlineIcon} label="Creado por">
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {createdByUser?.email ?? "Desconocido"}
                </Typography>
              </MetaItem>
            )}
          </Box>

          {/* Assigned — solo visible para admin/support */}
          {isPrivileged && (
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

        {/* ── CONTROLS ───────────────────────────────────────── */}
        {isPrivileged && (
          <Box>
            <Typography
              variant="overline"
              color="text.disabled"
              sx={{ mb: 1.5, display: "block" }}
            >
              Acciones
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {user?.role === ROLES.ADMIN && (
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Asignar técnico</InputLabel>
                  <Select
                    label="Asignar técnico"
                    value={ticket.assigned_to ?? ""}
                    onChange={(e) => {
                      updateTicket({ assigned_to: Number(e.target.value) });
                      showNotification(
                        "Ticket asignado correctamente",
                        "success",
                      );
                    }}
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

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  value={ticket.status}
                  onChange={(e) => {
                    updateTicket({ status: e.target.value });
                    showNotification(
                      `Estado actualizado a ${e.target.value}`,
                      "success",
                    );
                  }}
                >
                  {TICKET_STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
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
