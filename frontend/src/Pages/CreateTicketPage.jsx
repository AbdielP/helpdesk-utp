import { getCurrentUser } from "../services/authService";
import { useState } from "react";
import {
  Box,
  TextField,
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
import Button from "../shared/Button";

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

    const now = new Date().toISOString();
    const newTicket = {
      id: Date.now(),
      ...formData,
      status: "Abierto",
      created_by: currentUser.id,
      assigned_to: null,
      created_at: now,
      updated_at: now,
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            Nuevo ticket
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Describe tu problema o solicitud y completa la información básica
            para que podamos darle seguimiento.
          </Typography>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            borderColor: "#DDDADF",
          }}
        >
          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ p: { xs: 2, md: 3 } }}>
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

            <Divider />

            <Box sx={{ p: { xs: 2, md: 3 } }}>
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
                minRows={7}
                required
                placeholder="Incluye contexto, pasos para reproducir el problema, mensajes de error u otra información útil."
                sx={{
                  ...inputFieldStyles,
                  "& .MuiInputBase-root": {
                    alignItems: "flex-start",
                  },
                }}
              />
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="caption" sx={sectionLabelStyles}>
                Clasificación
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  gap: 2,
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
                px: { xs: 2, md: 3 },
                py: 2,
                backgroundColor: theme.palette.background.paper,
                borderTop: "1px solid",
                borderColor: "#DDDADF",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Los campos marcados con * son obligatorios
                </Typography>

                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  <Button appearance="secondary" onClick={handleClearForm} sx={{ px: 3 }}>
                    Limpiar
                  </Button>

                  <Button type="submit" disabled={!isFormComplete} sx={{ px: 3.5 }}>
                    Crear ticket
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ height: { xs: 40, md: 56 } }} />
      </Box>
    </Box>
  );
}
