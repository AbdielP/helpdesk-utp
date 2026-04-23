import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ERROR_MESSAGES, ROUTES, TICKET_CATEGORIES } from "../constants/constants";
import { useAuth } from "../context/AuthContext";
import { createTicket } from "../services/ticketService";
import { useNotification } from "../shared/NotificationProvider";
import BackNavigationButton from "../shared/BackNavigationButton";
import Button from "../shared/Button";
import PrioritySelectField from "../shared/PrioritySelectField";

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  category: "",
  priority: "",
};

export default function CreateTicketPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      showNotification(ERROR_MESSAGES.NO_SESSION_USER, "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const createdTicket = await createTicket({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        created_by: user.id,
        assigned_to: null,
      });

      showNotification(`Ticket creado: ${createdTicket.title}`, "success");
      setFormData(INITIAL_FORM_STATE);
      navigate(ROUTES.HOME);
    } catch {
      showNotification(ERROR_MESSAGES.GENERIC, "error");
    } finally {
      setIsSubmitting(false);
    }
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
            Describe tu problema o solicitud y completa la informacion basica
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
                Identificacion
              </Typography>
              <TextField
                fullWidth
                label="Titulo del ticket"
                name="title"
                value={formData.title}
                onChange={handleFormFieldChange}
                required
                disabled={isSubmitting}
                placeholder="Ej: No puedo acceder a mi cuenta"
                sx={inputFieldStyles}
              />
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="caption" sx={sectionLabelStyles}>
                Descripcion
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
                disabled={isSubmitting}
                placeholder="Incluye contexto, pasos para reproducir el problema, mensajes de error u otra informacion util."
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
                Clasificacion
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                <TextField
                  select
                  fullWidth
                  label="Categoria"
                  name="category"
                  value={formData.category}
                  onChange={handleFormFieldChange}
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  <Button
                    appearance="secondary"
                    onClick={handleClearForm}
                    sx={{ px: 3 }}
                    disabled={isSubmitting}
                  >
                    Limpiar
                  </Button>

                  <Button
                    type="submit"
                    disabled={!isFormComplete || isSubmitting}
                    sx={{ px: 3.5 }}
                  >
                    {isSubmitting ? "Creando..." : "Crear ticket"}
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
