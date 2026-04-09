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
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
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
            value={form.title}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={form.description}
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
              value={form.category}
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
              value={form.priority}
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
