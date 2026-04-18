import Chip from "@mui/material/Chip";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../constants/constants";

/**
 * Componente reutilizable para mostrar chips de prioridad o estado
 * @param {string} type - "priority" o "status"
 * @param {string} value - Valor del chip (ej: "Alta", "Abierto")
 * @param {string} variant - "filled" o "outlined"
 */
const TicketChip = ({ type = "priority", value, variant = "filled" }) => {
  const config = type === "priority" ? PRIORITY_CONFIG[value] : STATUS_CONFIG[value];

  if (!config) return null;

  return (
    <Chip
      label={config.label || value}
      size="small"
      color={config.color}
      variant={variant}
      sx={{
        fontWeight: 600,
        borderRadius: 1,
      }}
    />
  );
};

export default TicketChip;
