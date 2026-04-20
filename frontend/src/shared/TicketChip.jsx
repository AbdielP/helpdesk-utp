import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

/**
 * Componente reutilizable para mostrar chips de prioridad o estado
 * @param {string} type - "priority" o "status"
 * @param {string} value - Valor del chip (ej: "Alta", "Abierto")
 * @param {string} variant - "filled" o "outlined"
 */
const TicketChip = ({ type = "priority", value, variant = "filled" }) => {
  const theme = useTheme();

  if (type === "priority") {
    const colors = theme.custom.colors.priorities[value];
    if (!colors) return null;
    return (
      <Chip
        label={value}
        size="small"
        sx={{
          backgroundColor: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`,
          fontWeight: 600,
          borderRadius: 1,
        }}
      />
    );
  }

  // Type: status
  const statusColorMap = {
    Abierto: "info",
    "En proceso": "warning",
    Cerrado: "success",
  };

  return (
    <Chip
      label={value}
      size="small"
      color={statusColorMap[value]}
      variant={variant}
      sx={{
        fontWeight: 600,
        borderRadius: 1,
      }}
    />
  );
};

export default TicketChip;
