import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { TICKET_PRIORITIES, PRIORITY_CUSTOM_COLORS } from "../constants/constants";

const INPUT_FIELD_STYLES = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#FAFAFA",
    fontSize: "0.9rem",
    "& fieldset": {
      borderColor: "#E2E8F0",
    },
    "&:hover fieldset": {
      borderColor: "#CBD5E1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6366F1",
      borderWidth: "1.5px",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    color: "#94A3B8",
    "&.Mui-focused": {
      color: "#6366F1",
    },
  },
};

/**
 * Componente reutilizable para el select de prioridad
 * Incluye renderizado custom con colores
 */
const PrioritySelectField = ({ value, onChange, required = false }) => {
  return (
    <TextField
      select
      fullWidth
      label="Prioridad"
      name="priority"
      value={value}
      onChange={onChange}
      required={required}
      sx={INPUT_FIELD_STYLES}
      SelectProps={{
        renderValue: (selectedValue) => {
          const priorityColors = PRIORITY_CUSTOM_COLORS[selectedValue];
          if (!priorityColors) return selectedValue;
          return (
            <Chip
              label={selectedValue}
              size="small"
              sx={{
                backgroundColor: priorityColors.bg,
                color: priorityColors.color,
                border: `1px solid ${priorityColors.border}`,
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
        const priorityColors = PRIORITY_CUSTOM_COLORS[priorityOption];
        return (
          <MenuItem key={priorityOption} value={priorityOption}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {priorityColors && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: priorityColors.color,
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
