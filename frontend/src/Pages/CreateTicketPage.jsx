import { getCurrentUser } from "../services/authService";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import {
  STORAGE_KEYS,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "../constants/constants";

const initialFormState = {
  title: "",
  description: "",
  category: "",
  priority: "",
};

export default function CreateTicketPage() {
  const [formData, setFormData] = useState(initialFormState);

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
      JSON.stringify([...existing, newTicket]),
    );
    // Usar un snackbar o alguna forma de notificación mas adelante.
    alert(`Ticket creado: ${newTicket.title}`);

    setFormData(initialFormState);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        flex: 1,
        minHeight: 0,
        p: 3,
        backgroundColor: "#f5f6fa",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 700,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Nuevo Ticket
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <TextField
            fullWidth
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />

          {/* AQUÍ está el fix real */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              select
              label="Categoría"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              sx={{ flex: 1, minWidth: 200 }}
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
              sx={{ flex: 1, minWidth: 200 }}
            >
              {TICKET_PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" type="submit">
              Enviar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
