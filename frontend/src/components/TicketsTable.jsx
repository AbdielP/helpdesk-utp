import { useMemo, useState } from "react";
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
import TicketChip from "../shared/TicketChip";

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
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: 0,
      }}
    >
      <TableContainer sx={{ overflow: "auto", minHeight: 0 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderBottomColor: "#DDDADF",
                  fontWeight: 700,
                }}
              >
                <TableSortLabel
                  active={orderByField === "title"}
                  direction={orderByField === "title" ? orderDirection : "asc"}
                  onClick={() => handleRequestSort("title")}
                >
                  Título
                </TableSortLabel>
              </TableCell>

              <TableCell
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderBottomColor: "#DDDADF",
                  fontWeight: 700,
                }}
              >
                <TableSortLabel
                  active={orderByField === "status"}
                  direction={orderByField === "status" ? orderDirection : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Estado
                </TableSortLabel>
              </TableCell>

              <TableCell
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderBottomColor: "#DDDADF",
                  fontWeight: 700,
                }}
              >
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

              {user?.role === ROLES.ADMIN && (
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderBottomColor: "#DDDADF",
                    fontWeight: 700,
                  }}
                >
                  Técnico
                </TableCell>
              )}

              <TableCell
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderBottomColor: "#DDDADF",
                  fontWeight: 700,
                }}
              >
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

              <TableCell
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderBottomColor: "#DDDADF",
                }}
              />
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={user?.role === ROLES.ADMIN ? 6 : 5}>
                  <Box sx={{ textAlign: "center", py: 6 }}>
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
                .map((ticket, index) => {
                  const tecnico = users.find(
                    (userItem) => userItem.id === ticket.assigned_to,
                  );
                  const avatarColor =
                    theme.custom.colors.categories[ticket.category] || "#64748b";
                  const isEvenRow = index % 2 === 0;
                  const rowBackgroundColor = isEvenRow
                    ? theme.palette.background.paper
                    : theme.palette.background.default;
                  const closedRowBackgroundColor = isEvenRow
                    ? "rgba(0,0,0,0.04)"
                    : "rgba(0,0,0,0.02)";

                  return (
                    <TableRow
                      hover
                      key={ticket.id}
                      onClick={() => onRowClick(ticket.id)}
                      sx={{
                        cursor: "pointer",
                        opacity: ticket.status === "Cerrado" ? 0.68 : 1,
                        backgroundColor:
                          ticket.status === "Cerrado"
                            ? closedRowBackgroundColor
                            : rowBackgroundColor,
                        "& td": {
                          borderBottomColor: "#E4E0E7",
                          py: 2,
                        },
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
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {ticket.category?.[0] || "T"}
                          </Box>

                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>
                              {ticket.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {ticket.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            width: 112,
                            "& .MuiChip-root": {
                              width: "100%",
                              justifyContent: "center",
                            },
                          }}
                        >
                          <TicketChip type="status" value={ticket.status} />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            width: 88,
                            "& .MuiChip-root": {
                              width: "100%",
                              justifyContent: "center",
                            },
                          }}
                        >
                          <TicketChip type="priority" value={ticket.priority} />
                        </Box>
                      </TableCell>

                      {user?.role === ROLES.ADMIN && (
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {tecnico ? tecnico.email : "No asignado"}
                          </Typography>
                        </TableCell>
                      )}

                      <TableCell>
                        <Typography variant="body2">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </Typography>
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

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={sortedTickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid",
          borderColor: "#DDDADF",
          backgroundColor: "#FFFFFF",
        }}
      />
    </Paper>
  );
}
