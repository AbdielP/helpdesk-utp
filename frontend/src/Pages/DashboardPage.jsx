import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "../services/authService"

const DashboardPage = () => {
    const navigate = useNavigate()

  const [tickets, setTickets] = useState([])
  const [filtered, setFiltered] = useState([])
  const [user, setUser] = useState(null)

  // Obtener usuario desde cookie
  useEffect(() => {
    const user = getCurrentUser()
    setUser(user)
  }, [])

  // Obtener tickets desde localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tickets")) || []
    setTickets(data)
  }, [])

  // Filtrar según rol
  useEffect(() => {
    if (!user) return

    let result = []

    if (user.role === "user") {
      result = tickets.filter(t => t.created_by === user.id)
    } else if (user.role === "support") {
      result = tickets.filter(t => t.assigned_to === user.id)
    } else if (user.role === "admin") {
      result = tickets
    }

    setFiltered(result)
  }, [tickets, user])

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {user?.role === "user" && "Mis Tickets"}
        {user?.role === "tech" && "Tickets Asignados"}
        {user?.role === "admin" && "Todos los Tickets"}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filtered.length === 0 && (
          <Typography color="text.secondary">
            No hay tickets
          </Typography>
        )}

        {filtered.map((t) => (
          <Paper
            key={t.id}
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.03)",
              },
            }}
            onClick={() => navigate(`/ticket/${t.id}`)}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {t.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Estado: {t.status}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Prioridad: {t.priority}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {new Date(t.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}

export default DashboardPage