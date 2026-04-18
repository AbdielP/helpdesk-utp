import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackNavigationButton = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{
          textTransform: "none",
          color: "text.secondary",
          px: 0,
          "&:hover": { background: "transparent", color: "primary.main" },
        }}
      >
        Volver al dashboard
      </Button>
    </Box>
  );
};

export default BackNavigationButton;
