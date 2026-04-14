import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { users } from "../mocks/users";
import { ROLES } from "../constants/constants";

export default function TicketsTable({ tickets = [], user, onRowClick }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <TableContainer
        sx={{ flex: 1, height: 0, overflow: "auto", minHeight: 0 }}
      >
        {/* TABLA */}
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
              {user?.role === ROLES.ADMIN && <TableCell>Técnico</TableCell>}
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => {
                const tecnico = users.find(
                  (userItem) => userItem.id === ticket.assigned_to,
                );

                // 🎨 colores
                const statusColor =
                  ticket.status === "Abierto"
                    ? "#3b82f6"
                    : ticket.status === "En proceso"
                      ? "#f59e0b"
                      : "#10b981";

                const priorityColor =
                  ticket.priority === "Alta"
                    ? "#ef4444"
                    : ticket.priority === "Media"
                      ? "#f59e0b"
                      : "#10b981";

                const categoryColorMap = {
                  Plataforma: "#6366f1",
                  Cuenta: "#ec4899",
                  Hardware: "#14b8a6",
                  Software: "#f97316",
                };

                const avatarColor =
                  categoryColorMap[ticket.category] || "#64748b";

                return (
                  <TableRow
                    hover
                    key={ticket.id}
                    onClick={() => onRowClick(ticket.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    {/* TÍTULO + AVATAR */}
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundColor: avatarColor,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {ticket.category?.[0] || "T"}
                        </Box>

                        <Box>
                          <Typography fontWeight={500}>
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ticket.category}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* ESTADO */}
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: statusColor,
                          color: "#fff",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "999px",
                          fontSize: 12,
                          width: "fit-content",
                        }}
                      >
                        {ticket.status}
                      </Box>
                    </TableCell>

                    {/* PRIORIDAD */}
                    <TableCell>
                      <Typography
                        sx={{ color: priorityColor, fontWeight: 600 }}
                      >
                        {ticket.priority}
                      </Typography>
                    </TableCell>

                    {/* TÉCNICO */}
                    {user?.role === ROLES.ADMIN && (
                      <TableCell>
                        {tecnico ? tecnico.email : "No asignado"}
                      </TableCell>
                    )}

                    {/* FECHA */}
                    <TableCell>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
