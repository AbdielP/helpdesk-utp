import { Box, Grid, TextField, Button, Typography, Stack } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate("/");
  }

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Imagen izquierda */}
      <Grid
        size={{ xs: 0, md: 5.4 }}
        sx={{
          display: { xs: "none", md: "block" },
          backgroundImage: "url('/campus-civil-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Formulario (Derecha) */}
      <Grid
        size={{ xs: 12, md: 6.6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <Stack spacing={3}>
            {/* Title / Logo */}
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={600}>
                HelpDesk UTP
              </Typography>
            </Box>

            {/* Inputs */}
            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
            />

            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
            />

            {/* Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 600,
              }}
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>

            {/* Footer */}
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
            >
              Universidad Tecnológica de Panamá - 2026
            </Typography>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;