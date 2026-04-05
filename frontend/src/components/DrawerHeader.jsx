import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const DrawerHeader = () => {
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
    />
  );
};

export default DrawerHeader;