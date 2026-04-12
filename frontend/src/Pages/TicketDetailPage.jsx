import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"

const TicketDetailPage = () => {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tickets")) || []
    const found = data.find(t => t.id === Number(id))
    setTicket(found)
  }, [id])

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
      </Paper>
    </Box>
  )
}

export default TicketDetailPage