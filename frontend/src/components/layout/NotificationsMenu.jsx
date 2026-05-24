import { useEffect, useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SyncIcon from "@mui/icons-material/Sync";
import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from "../../context/AuthContext";
import {
  createNotificationsConnection,
  getUnreadCount,
  getUserNotifications,
  markAllAsRead,
} from "../../services/notificationService";

const typeConfig = {
  "ticket.created": {
    title: "Nuevo ticket creado",
    icon: <PersonIcon fontSize="small" />,
    color: "#7A2A83",
  },
  "ticket.assigned": {
    title: "Ticket asignado",
    icon: <PersonIcon fontSize="small" />,
    color: "#4F8FEA",
  },
  "ticket.status_changed": {
    title: "Estado actualizado",
    icon: <SyncIcon fontSize="small" />,
    color: "#D87A08",
  },
  "ticket.closed": {
    title: "Ticket cerrado",
    icon: <CheckIcon fontSize="small" />,
    color: "#3F8D57",
  },
};

const formatNotificationTime = (value) => {
  if (!value) {
    return "";
  }

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) {
    return "";
  }

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return "Hace un momento";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes === 1 ? "" : "s"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours === 1 ? "" : "s"}`;
  }

  return createdAt.toLocaleDateString("es-PA");
};

/**
 * Menu de notificaciones en tiempo real.
 * Combina una carga inicial por HTTP con eventos SignalR para mantener contador y lista al dia.
 */
const NotificationsMenu = () => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const open = Boolean(anchorEl);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return undefined;
    }

    let active = true;

    const loadNotifications = async () => {
      const [userNotifications, count] = await Promise.all([
        getUserNotifications(userId),
        getUnreadCount(userId),
      ]);

      if (active) {
        setNotifications(userNotifications);
        setUnreadCount(count);
      }
    };

    loadNotifications().catch(() => {
      if (active) {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const connection = createNotificationsConnection(userId);

    connection.on("NotificationReceived", (notification) => {
      setNotifications((currentNotifications) => [
        notification,
        ...currentNotifications.filter((item) => item.id !== notification.id),
      ].slice(0, 20));
    });

    connection.on("UnreadCountChanged", (count) => {
      setUnreadCount(count);
    });

    connection.start().catch(() => {});

    return () => {
      connection.stop().catch(() => {});
    };
  }, [userId]);

  const visibleNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) {
      return;
    }

    await markAllAsRead(userId);
    setUnreadCount(0);
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="notificaciones"
        aria-controls={open ? "notifications-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
        sx={{
          mr: { xs: 0.5, sm: 1.25 },
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          overlap="circular"
          invisible={unreadCount === 0}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.7rem",
              fontWeight: 700,
              minWidth: 18,
              height: 18,
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id="notifications-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "calc(100vw - 32px)", sm: 420 },
              maxWidth: "calc(100vw - 32px)",
              mt: 1,
              borderRadius: "6px",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.2)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notificaciones
          </Typography>

          <Button
            size="small"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            sx={{
              color: "primary.main",
              fontSize: "0.72rem",
              fontWeight: 700,
              minWidth: "auto",
              p: 0,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Marcar todas como leidas
          </Button>
        </Box>

        <Divider />

        {visibleNotifications.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No hay notificaciones
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {visibleNotifications.map((notification, index) => {
              const config = typeConfig[notification.type] ?? typeConfig["ticket.status_changed"];

              return (
                <Box key={notification.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 2,
                      py: 1.75,
                      gap: 1.5,
                      backgroundColor: notification.is_read
                        ? "#FFFFFF"
                        : "rgba(63, 122, 224, 0.03)",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        mt: 0.25,
                        backgroundColor: config.color,
                        color: "#FFFFFF",
                      }}
                    >
                      {config.icon}
                    </Avatar>

                    <Stack spacing={0.35} sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: "text.primary" }}
                      >
                        {config.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.primary",
                          fontSize: "0.82rem",
                          lineHeight: 1.35,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        {formatNotificationTime(notification.created_at)}
                      </Typography>
                    </Stack>

                    {!notification.is_read && (
                      <Box
                        aria-label="No leida"
                        sx={{
                          width: 9,
                          height: 9,
                          mt: 1,
                          borderRadius: "50%",
                          backgroundColor: "info.main",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </ListItem>
                  {index < visibleNotifications.length - 1 && <Divider />}
                </Box>
              );
            })}
          </List>
        )}
      </Popover>
    </>
  );
};

export default NotificationsMenu;
