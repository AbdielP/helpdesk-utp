import { Box, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_ERRORS, ERROR_MESSAGES, ROUTES } from "../constants/constants";
import { useAuth } from "../context/AuthContext";
import { useRequest } from "../hooks/useRequest";
import Button from "../shared/Button";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const inputFieldStyles = theme.custom.form.inputFieldStyles;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginRequest = useRequest();
  const isSubmitting = loginRequest.isLoading;

  const handleLogin = async () => {
    try {
      setError("");
      await loginRequest.run((requestConfig) => login(email, password, requestConfig));
      navigate(ROUTES.HOME);
    } catch (err) {
      if (err.message === AUTH_ERRORS.INVALID_CREDENTIALS) {
        setError(ERROR_MESSAGES[AUTH_ERRORS.INVALID_CREDENTIALS]);
      } else if (err.message === AUTH_ERRORS.NETWORK_ERROR) {
        setError(ERROR_MESSAGES[AUTH_ERRORS.NETWORK_ERROR]);
      } else {
        setError(ERROR_MESSAGES.GENERIC);
      }
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        size={{ xs: 0, md: 5.4 }}
        sx={{
          display: { xs: "none", md: "block" },
          backgroundImage: "url('/campus-civil-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid
        size={{ xs: 12, md: 6.6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 330 }}>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Box
                component="img"
                src="/helpdeskutp_logo.png"
                alt="Helpdesk UTP"
                sx={{ width: 300, height: "auto", mx: "auto", mb: 2 }}
              />
            </Box>

            <TextField
              label="Correo electronico"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              sx={inputFieldStyles}
            />

            <TextField
              label="Contrasena"
              type="password"
              fullWidth
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              sx={inputFieldStyles}
            />

            <Button
              size="large"
              fullWidth
              sx={{ py: 2 }}
              onClick={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando..." : "Iniciar sesion"}
            </Button>

            {isSubmitting && (
              <Stack spacing={0.5} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  {loginRequest.attempt === loginRequest.maxAttempts
                    ? `Ultimo intento de conexion ${loginRequest.attempt}/${loginRequest.maxAttempts}`
                    : loginRequest.attempt > 1
                      ? `Reintentando conexion ${loginRequest.attempt}/${loginRequest.maxAttempts}`
                      : `Intentando conexion ${loginRequest.attempt}/${loginRequest.maxAttempts}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tiempo limite por intento: {Math.ceil(loginRequest.timeoutMs / 1000)}s
                </Typography>
              </Stack>
            )}

            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}

            <Divider />

            <Typography
              variant="caption"
              textAlign="center"
              color="text.secondary"
            >
              Universidad Tecnologica de Panama - 2026
            </Typography>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
