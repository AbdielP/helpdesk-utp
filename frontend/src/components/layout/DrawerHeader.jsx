import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const DrawerHeader = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 1,
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
      }}
    >
      {children}
    </Box>
  );
};

export default DrawerHeader;
