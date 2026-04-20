import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { DRAWER_WIDTH, ROUTES } from "../../constants/constants";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = ({ open, handleDrawerOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        transition: "margin 225ms, width 225ms",
        ...(open
          ? {
              width: `calc(100% - ${DRAWER_WIDTH}px)`,
              marginLeft: `${DRAWER_WIDTH}px`,
            }
          : {
              width: "100%",
              marginLeft: 0,
            }),
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: open ? "none" : "inline-flex" }}
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src="/helpdeskutp_logo_light.png"
            alt="Helpdesk UTP"
            sx={{
              width: { xs: 130, sm: 130, md: 140 },
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Box>

        <Button
          color="inherit"
          startIcon={<AccountCircle />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 300,
            borderRadius: "999px",
            px: 1.5,
            py: 0.75,
            minWidth: "auto",
            lineHeight: 1.1,
            gap: 0.5,
            "&:hover": {
              backgroundColor: "transparent",
              color: "rgba(255, 255, 255, 0.84)",
              textDecoration: "underline",
            },
          }}
        >
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
