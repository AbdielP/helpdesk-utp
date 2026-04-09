import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";

const categorias = ["Red", "Plataforma", "Cuenta", "Hardware"];
const prioridades = ["Baja", "Media", "Alta"];

export default function CreateTicketPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newTicket = {
      id: Date.now(),
      ...formData,
      status: "Abierto",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("tickets")) || [];
    localStorage.setItem("tickets", JSON.stringify([...existing, newTicket]));

    alert(`Ticket creado: ${newTicket.title}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        minHeight: "calc(100vh - 64px)",
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
              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
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
              {prioridades.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
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
