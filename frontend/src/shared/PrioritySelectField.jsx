import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { TICKET_PRIORITIES } from "../constants/constants";

/**
 * Componente reutilizable para el select de prioridad
 * Incluye renderizado custom con colores
 */
const PrioritySelectField = ({ value, onChange, required = false }) => {
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
      sx={inputFieldStyles}
      SelectProps={{
        renderValue: (selectedValue) => {
          const colors = priorityColors[selectedValue];
          if (!colors) return selectedValue;
          return (
            <Chip
              label={selectedValue}
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
        const colors = priorityColors[priorityOption];
        return (
          <MenuItem key={priorityOption} value={priorityOption}>
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
              {priorityOption}
            </Box>
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default PrioritySelectField;
