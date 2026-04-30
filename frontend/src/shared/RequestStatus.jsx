import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const getLoadingMessage = ({ attempt, maxAttempts }) => {
  if (attempt <= 1) {
    return `Intentando conexion ${attempt}/${maxAttempts}`;
  }

  if (attempt === maxAttempts) {
    return `Ultimo intento de conexion ${attempt}/${maxAttempts}`;
  }

  return `Reintentando conexion ${attempt}/${maxAttempts}`;
};

const getFailureMessage = (reason) => {
  if (reason === "timeout") {
    return "La solicitud supero el tiempo limite.";
  }

  if (reason === "network") {
    return "No se pudo conectar con el servicio.";
  }

  if (reason === "server") {
    return "El servicio respondio con un error temporal.";
  }

  return null;
};

const getFinalFailureMessage = ({ lastFailureReason, maxAttempts }) => {
  if (lastFailureReason === "timeout") {
    return `La solicitud supero el tiempo limite despues de ${maxAttempts} intentos.`;
  }

  return `No se pudo completar la solicitud despues de ${maxAttempts} intentos.`;
};

const RequestStatus = ({
  label = "Cargando informacion",
  request,
  minHeight = 180,
  onRetry,
}) => {
  if (request.error) {
    return (
      <Box
        sx={{
          minHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: 4,
        }}
      >
        <Stack spacing={1.5} alignItems="center" textAlign="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            No se pudo cargar la informacion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getFinalFailureMessage(request)}
          </Typography>
          {onRetry && (
            <Button variant="outlined" onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
        py: 4,
      }}
    >
      <Stack spacing={1.25} alignItems="center" textAlign="center">
        <CircularProgress size={32} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {getLoadingMessage(request)}
        </Typography>
        {request.lastFailureReason && (
          <Typography variant="caption" color="text.secondary">
            {getFailureMessage(request.lastFailureReason)}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default RequestStatus;
