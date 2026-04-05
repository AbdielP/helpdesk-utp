import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { DRAWER_WIDTH } from "../../constants/constants";

const Topbar = ({ open, handleDrawerOpen }) => {
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

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HelpDesk UTP
        </Typography>

        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
