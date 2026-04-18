import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Componente para mostrar información de meta (categoría, prioridad, fecha, etc.)
 * con icono y etiqueta
 */
const MetaInfoItem = ({ Icon, label, children }) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
      <Icon sx={{ fontSize: 15, color: "text.disabled" }} />
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
    </Box>
    {children}
  </Box>
);

export default MetaInfoItem;
