import styles from "./CreateTicketPage.module.css";
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
} from "@mui/material";
import { STORAGE_KEYS, TICKET_CATEGORIES } from "../constants/constants";
import { useNotification } from "../shared/NotificationProvider";
import BackNavigationButton from "../shared/BackNavigationButton";
import PrioritySelectField from "../shared/PrioritySelectField";
import { useTheme } from "@mui/material/styles";

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  category: "",
  priority: "",
};

export default function CreateTicketPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const { showNotification } = useNotification();
  const theme = useTheme();
  const inputFieldStyles = theme.custom.form.inputFieldStyles;
  const sectionLabelStyles = theme.custom.form.sectionLabelStyles;

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

    const existingTickets =
      JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || [];
    localStorage.setItem(
      STORAGE_KEYS.TICKETS,
      JSON.stringify([...existingTickets, newTicket]),
    );

    showNotification(`Ticket creado: ${newTicket.title}`, "success");
    setFormData(INITIAL_FORM_STATE);
  };

  const handleClearForm = () => {
    setFormData(INITIAL_FORM_STATE);
  };

  const isFormComplete =
    formData.title &&
    formData.description &&
    formData.category &&
    formData.priority;

  return (
    <Box className={styles.pageWrapper}>
      <Box className={styles.container}>
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
            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography variant="caption" sx={sectionLabelStyles}>
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
                sx={inputFieldStyles}
              />
            </Box>

            <Divider sx={{ borderColor: "#F1F5F9" }} />

            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography variant="caption" sx={sectionLabelStyles}>
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
                  ...inputFieldStyles,
                  "& .MuiInputBase-root": {
                    alignItems: "flex-start",
                    paddingTop: "14px",
                  },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: "#F1F5F9" }} />

            <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 2 }}>
              <Typography variant="caption" sx={sectionLabelStyles}>
                Clasificación
              </Typography>

              <Box className={styles.grid}>
                <TextField
                  select
                  fullWidth
                  label="Categoría"
                  name="category"
                  value={formData.category}
                  onChange={handleFormFieldChange}
                  required
                  sx={inputFieldStyles}
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

            <Box
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 1.5,
                backgroundColor: "#F8FAFC",
                borderTop: "1px solid #F1F5F9",
              }}
            >
              <Box className={styles.actions}>
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
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
