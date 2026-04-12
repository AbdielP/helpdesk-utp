import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { getCurrentUser } from "../services/authService"

const TicketDetailPage = () => {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tickets")) || []
    const found = data.find(t => t.id === Number(id))
    setTicket(found)
  }, [id])

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  if (!ticket) {
    return <Typography>No se encontró el ticket</Typography>
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {ticket.title}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Descripción:</strong> {ticket.description}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Categoría:</strong> {ticket.category}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Prioridad:</strong> {ticket.priority}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Estado:</strong> {ticket.status}
        </Typography>

        <Typography color="text.secondary">
          {new Date(ticket.created_at).toLocaleString()}
        </Typography>

        {/* Opciones de asignación y cambio de estado según el rol del usuario */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
            flexWrap: "wrap"
          }}
        >
          {user?.role === "admin" && (
            <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel>Asignar a técnico</InputLabel>
              <Select label="Asignar a técnico" defaultValue="">
                <MenuItem value="">
                  <em>Sin asignar</em>
                </MenuItem>
                <MenuItem value="1">Técnico 1</MenuItem>
                <MenuItem value="2">Técnico 2</MenuItem>
              </Select>
            </FormControl>
          )}

          {(user?.role === "admin" || user?.role === "support") && (
            <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel>Estado</InputLabel>
              <Select label="Estado" defaultValue={ticket.status}>
                <MenuItem value="Abierto">Abierto</MenuItem>
                <MenuItem value="En proceso">En proceso</MenuItem>
                <MenuItem value="Cerrado">Cerrado</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default TicketDetailPage