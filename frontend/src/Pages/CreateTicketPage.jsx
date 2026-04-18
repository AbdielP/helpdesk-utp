import { getCurrentUser } from "../services/authService";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import {
  STORAGE_KEYS,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "../constants/constants";
import { useNotification } from "../shared/NotificationProvider";
import BackNavigationButton from "../shared/BackNavigationButton";

const PRIORITY_COLORS = {
  Alta: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
  Media: { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
  Baja: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
};

const initialFormState = {
  title: "",
  description: "",
  category: "",
  priority: "",
};

export default function CreateTicketPage() {
  const [formData, setFormData] = useState(initialFormState);
  const { showNotification } = useNotification();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      alert("No hay usuario en sesión");
      return;
    }

    const newTicket = {
      id: Date.now(),
      ...formData,
      status: "Abierto",
      created_by: user.id,
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // !! Aquí se guarda el ticket en localStorage para simular una base de datos
    // CAMBIAR A UNA LLAMADA REAL A LA API CUANDO ESTÉ LISTA
    const existing =
      JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    localStorage.setItem(
      STORAGE_KEYS.TICKETS,
      JSON.stringify([...existing, newTicket])
    );

    showNotification(`Ticket creado: ${newTicket.title}`, "success");
    setFormData(initialFormState);
  };

  const isComplete =
    formData.title && formData.description && formData.category && formData.priority;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        flex: 1,
        minHeight: 0,
        p: { xs: 1.5, sm: 2 },
        backgroundColor: "#F8F9FC",
        overflow: "auto",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 860 }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          {/* BTN VOLVER */}
          <BackNavigationButton />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: "1.65rem",
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            Nuevo ticket
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748B", mt: 0.25, fontSize: "0.875rem" }}
          >
            Describe tu problema o solicitud y te ayudaremos a resolverlo.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          {/* Form body */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Section: Identificación */}
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#94A3B8",
                  display: "block",
                  mb: 1.25,
                }}
              >
                Identificación
              </Typography>

              <TextField
                fullWidth
                label="Título del ticket"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: No puedo acceder a mi cuenta"
                sx={fieldStyles}
              />
            </Box>

            <Divider sx={{ borderColor: "#F1F5F9" }} />

            {/* Section: Descripción */}
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#94A3B8",
                  display: "block",
                  mb: 1.25,
                }}
              >
                Descripción
              </Typography>

              <TextField
                fullWidth
                label="Describe el problema en detalle"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
                placeholder="Incluye pasos para reproducir el problema, mensajes de error, capturas de pantalla, etc."
                sx={{
                  ...fieldStyles,
                  "& .MuiInputBase-root": {
                    alignItems: "flex-start",
                    paddingTop: "14px",
                  },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: "#F1F5F9" }} />

            {/* Section: Clasificación */}
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#94A3B8",
                  display: "block",
                  mb: 1.25,
                }}
              >
                Clasificación
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2.5,
                }}
              >
                <TextField
                  select
                  label="Categoría"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  sx={fieldStyles}
                >
                  {TICKET_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Prioridad"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  sx={fieldStyles}
                  SelectProps={{
                    renderValue: (selected) => {
                      const colors = PRIORITY_COLORS[selected];
                      if (!colors) return selected;
                      return (
                        <Chip
                          label={selected}
                          size="small"
                          sx={{
                            backgroundColor: colors.bg,
                            color: colors.color,
                            border: `1px solid ${colors.border}`,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: 22,
                          }}
                        />
                      );
                    },
                  }}
                >
                  {TICKET_PRIORITIES.map((priority) => {
                    const colors = PRIORITY_COLORS[priority];
                    return (
                      <MenuItem key={priority} value={priority}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          {colors && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: colors.color,
                                flexShrink: 0,
                              }}
                            />
                          )}
                          {priority}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Box>
            </Box>

            {/* Footer / Actions */}
            <Box
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 1.5,
                backgroundColor: "#F8FAFC",
                borderTop: "1px solid #F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#94A3B8", fontSize: "0.78rem" }}
              >
                Los campos marcados con * son obligatorios
              </Typography>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  onClick={() => setFormData(initialFormState)}
                  sx={{
                    borderColor: "#E2E8F0",
                    color: "#64748B",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: "10px",
                    px: 3,
                    "&:hover": {
                      borderColor: "#CBD5E1",
                      backgroundColor: "#F8FAFC",
                    },
                  }}
                >
                  Limpiar
                </Button>

                <Button
                  variant="contained"
                  type="submit"
                  disableElevation
                  sx={{
                    backgroundColor: isComplete ? "#6366F1" : "#C7D2FE",
                    color: isComplete ? "#fff" : "#818CF8",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 3.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: isComplete ? "#4F46E5" : "#C7D2FE",
                    },
                  }}
                >
                  Crear ticket
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#FAFAFA",
    fontSize: "0.9rem",
    "& fieldset": {
      borderColor: "#E2E8F0",
    },
    "&:hover fieldset": {
      borderColor: "#CBD5E1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6366F1",
      borderWidth: "1.5px",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    color: "#94A3B8",
    "&.Mui-focused": {
      color: "#6366F1",
    },
  },
};