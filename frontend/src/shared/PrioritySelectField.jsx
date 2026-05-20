import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { TICKET_PRIORITIES, TICKET_PRIORITY_LABELS } from "../constants/constants";

/**
 * Componente reutilizable para el select de prioridad
 * Incluye renderizado custom con colores
 */
const PrioritySelectField = ({
  value,
  onChange,
  required = false,
  disabled = false,
}) => {
  const theme = useTheme();
  const inputFieldStyles = theme.custom.form.inputFieldStyles;
  const priorityColors = theme.custom.colors.priorities;

  return (
    <TextField
      select
      fullWidth
      label="Prioridad"
      name="priority"
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      sx={inputFieldStyles}
      SelectProps={{
        renderValue: (selectedValue) => {
          const colors = priorityColors[selectedValue];
          const label = TICKET_PRIORITY_LABELS[selectedValue] ?? selectedValue;
          if (!colors) return selectedValue;
          return (
            <Chip
              label={label}
              size="small"
              sx={{
                backgroundColor: colors.bg,
                color: colors.color,
                border: `1px solid ${colors.border}`,
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 22,
              }}
            />
          );
        },
      }}
    >
      {TICKET_PRIORITIES.map((priorityOption) => {
        const colors = priorityColors[priorityOption.value];
        return (
          <MenuItem key={priorityOption.value} value={priorityOption.value}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {colors && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: colors.color,
                    flexShrink: 0,
                  }}
                />
              )}
              {priorityOption.label}
            </Box>
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default PrioritySelectField;
