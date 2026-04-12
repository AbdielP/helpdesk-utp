import { Box, Grid, TextField, Button, Typography, Stack } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AUTH_ERRORS, ERROR_MESSAGES, ROUTES } from "../constants/constants";

const LoginPage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);
      navigate(ROUTES.HOME);
    } catch (err) {
      if (err.message === AUTH_ERRORS.USER_NOT_FOUND) {
        setError(ERROR_MESSAGES[AUTH_ERRORS.USER_NOT_FOUND]);
      } else if (err.message === AUTH_ERRORS.INVALID_PASSWORD) {
        setError(ERROR_MESSAGES[AUTH_ERRORS.INVALID_PASSWORD]);
      } else {
        setError(ERROR_MESSAGES.GENERIC);
      }
    }
  };

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
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Stack spacing={3}>
            {/* Title */}
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={600}>
                HelpDesk UTP
              </Typography>
            </Box>

            {/* Email */}
            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            {/* Error */}
            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}

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