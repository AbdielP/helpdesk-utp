import { getCurrentUser } from "../services/authService";
import { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography, Paper, Divider } from "@mui/material";
import { STORAGE_KEYS, TICKET_CATEGORIES } from "../constants/constants";
import { useNotification } from "../shared/NotificationProvider";
import BackNavigationButton from "../shared/BackNavigationButton";
import PrioritySelectField from "../shared/PrioritySelectField";

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  category: "",
  priority: "",
};

const INPUT_FIELD_STYLES = {
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

const SECTION_LABEL_STYLES = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#94A3B8",
  display: "block",
  mb: 1.25,
};

export default function CreateTicketPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const { showNotification } = useNotification();

  const handleFormFieldChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) {
      showNotification("No hay usuario en sesión", "error");
      return;
    }

    const newTicket = {
      id: Date.now(),
      ...formData,
      status: "Abierto",
      created_by: currentUser.id,
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existingTickets = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    localStorage.setItem(
      STORAGE_KEYS.TICKETS,
      JSON.stringify([...existingTickets, newTicket])
    );

    showNotification(`Ticket creado: ${newTicket.title}`, "success");
    setFormData(INITIAL_FORM_STATE);
  };

  const isFormComplete =
    formData.title &&
    formData.description &&
    formData.category &&
    formData.priority;

  const handleClearForm = () => {
    setFormData(INITIAL_FORM_STATE);
  };

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

        {/* Form Container */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            {/* Title Section */}
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography variant="caption" sx={SECTION_LABEL_STYLES}>
                Identificación
              </Typography>
              <TextField
                fullWidth
                label="Título del ticket"
                name="title"
                value={formData.title}
                onChange={handleFormFieldChange}
                required
                placeholder="Ej: No puedo acceder a mi cuenta"
                sx={INPUT_FIELD_STYLES}
              />
            </Box>

            <Divider sx={{ borderColor: "#F1F5F9" }} />

            {/* Description Section */}
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography variant="caption" sx={SECTION_LABEL_STYLES}>
                Descripción
              </Typography>
              <TextField
                fullWidth
                label="Describe el problema en detalle"
                name="description"
                value={formData.description}
                onChange={handleFormFieldChange}
                multiline
                rows={3}
                required
                placeholder="Incluye pasos para reproducir el problema, mensajes de error, capturas de pantalla, etc."
                sx={{
                  ...INPUT_FIELD_STYLES,
                  "& .MuiInputBase-root": {
                    alignItems: "flex-start",
                    paddingTop: "14px",
                  },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: "#F1F5F9" }} />

            {/* Category and Priority Section */}
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography variant="caption" sx={SECTION_LABEL_STYLES}>
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
                  fullWidth
                  label="Categoría"
                  name="category"
                  value={formData.category}
                  onChange={handleFormFieldChange}
                  required
                  sx={INPUT_FIELD_STYLES}
                >
                  {TICKET_CATEGORIES.map((categoryOption) => (
                    <MenuItem key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </MenuItem>
                  ))}
                </TextField>

                <PrioritySelectField
                  value={formData.priority}
                  onChange={handleFormFieldChange}
                  required
                />
              </Box>
            </Box>

            {/* Form Actions */}
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
                  onClick={handleClearForm}
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
                  disabled={!isFormComplete}
                  sx={{
                    backgroundColor: isFormComplete ? "#6366F1" : "#C7D2FE",
                    color: isFormComplete ? "#fff" : "#818CF8",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 3.5,
                    transition: "all 0.2s ease",
                    cursor: isFormComplete ? "pointer" : "not-allowed",
                    "&:hover": {
                      backgroundColor: isFormComplete ? "#4F46E5" : "#C7D2FE",
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