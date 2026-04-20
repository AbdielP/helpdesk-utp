import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AUTH_ERRORS, ERROR_MESSAGES, ROUTES } from "../constants/constants";
import * as helpdeskutplogo from "../../public/helpdeskutp_logo.png";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const inputFieldStyles = theme.custom.form.inputFieldStyles;

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
        <Box sx={{ width: "100%", maxWidth: 330 }}>
          <Stack spacing={3}>
            {/* Logo */}
            <Box textAlign="center">
              <Box
                component="img"
                src="/helpdeskutp_logo.png"
                alt="Helpdesk UTP"
                sx={{ width: 300, height: "auto", mx: "auto", mb: 2 }}
              />
            </Box>

            {/* Email */}
            <TextField
              label="Correo electrónico"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={inputFieldStyles}
            />

            {/* Password */}
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={inputFieldStyles}
            />

            {/* Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 2,
                fontWeight: 600,
                backgroundColor: theme.palette.primary.main,
                textTransform: "none",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: theme.palette.primary.hover,
                },
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

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                or
              </Typography>
            </Divider>

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
