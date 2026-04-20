import { useState, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { users } from "../mocks/users";
import { ROLES, STATUS_ORDER } from "../constants/constants";

export default function TicketsTable({ tickets = [], user, onRowClick }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderDirection, setOrderDirection] = useState("asc");
  const [orderByField, setOrderByField] = useState(null);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (field) => {
    const isAscending = orderByField === field && orderDirection === "asc";
    setOrderDirection(isAscending ? "desc" : "asc");
    setOrderByField(field);
  };

  const sortedTickets = useMemo(() => {
    if (!orderByField) return tickets;

    const comparator = (a, b) => {
      let valueA = a[orderByField];
      let valueB = b[orderByField];

      if (orderByField === "status") {
        valueA = STATUS_ORDER[a.status];
        valueB = STATUS_ORDER[b.status];
      }

      if (orderByField === "created_at") {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) return orderDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return orderDirection === "asc" ? 1 : -1;
      return 0;
    };

    return [...tickets].sort(comparator);
  }, [tickets, orderDirection, orderByField]);

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
              <TableCell>
                <TableSortLabel
                  active={orderByField === "title"}
                  direction={orderByField === "title" ? orderDirection : "asc"}
                  onClick={() => handleRequestSort("title")}
                >
                  Título
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderByField === "status"}
                  direction={orderByField === "status" ? orderDirection : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Estado
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderByField === "priority"}
                  direction={
                    orderByField === "priority" ? orderDirection : "asc"
                  }
                  onClick={() => handleRequestSort("priority")}
                >
                  Prioridad
                </TableSortLabel>
              </TableCell>

              {user?.role === ROLES.ADMIN && <TableCell>Técnico</TableCell>}

              <TableCell>
                <TableSortLabel
                  active={orderByField === "created_at"}
                  direction={
                    orderByField === "created_at" ? orderDirection : "asc"
                  }
                  onClick={() => handleRequestSort("created_at")}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={user?.role === ROLES.ADMIN ? 5 : 4}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">
                      {user?.role === ROLES.USER && "No has creado tickets"}
                      {user?.role === ROLES.SUPPORT &&
                        "No tienes tickets asignados"}
                      {user?.role === ROLES.ADMIN &&
                        "No hay tickets en el sistema"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              sortedTickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket) => {
                  const tecnico = users.find(
                    (userItem) => userItem.id === ticket.assigned_to,
                  );

                  const statusColor = theme.custom.colors.statuses[ticket.status];
                  const priorityColors = theme.custom.colors.priorities[ticket.priority];
                  const avatarColor = theme.custom.colors.categories[ticket.category] || "#64748b";

                  return (
                    <TableRow
                      hover
                      key={ticket.id}
                      onClick={() => onRowClick(ticket.id)}
                      sx={{
                        cursor: "pointer",
                        opacity: ticket.status === "Cerrado" ? 0.6 : 1,
                        backgroundColor:
                          ticket.status === "Cerrado"
                            ? "rgba(0,0,0,0.03)"
                            : "inherit",
                      }}
                    >
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {ticket.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

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

                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor: priorityColors.bg,
                            color: priorityColors.color,
                            border: `1px solid ${priorityColors.border}`,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: 12,
                            fontWeight: 600,
                            width: "fit-content",
                          }}
                        >
                          {ticket.priority}
                        </Box>
                      </TableCell>

                      {user?.role === ROLES.ADMIN && (
                        <TableCell>
                          {tecnico ? tecnico.email : "No asignado"}
                        </TableCell>
                      )}

                      <TableCell>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell align="right">
                        <MoreHorizIcon sx={{ color: "text.secondary" }} />
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={sortedTickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
