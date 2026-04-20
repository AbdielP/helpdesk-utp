import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#681A5D",
      hover: "#7a4473",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#3b82f6",
    },
    success: {
      main: "#10b981",
    },
    error: {
      main: "#ef4444",
    },
  },
  custom: {
    colors: {
      priorities: {
        Alta: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
        Media: { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
        Baja: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
      },
      statuses: {
        Abierto: "#3b82f6",
        "En proceso": "#f59e0b",
        Cerrado: "#10b981",
      },
      categories: {
        Plataforma: "#6366f1",
        Cuenta: "#ec4899",
        Hardware: "#14b8a6",
        Red: "#64748b",
        Software: "#f97316",
      },
    },
    form: {
      inputFieldStyles: {
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
      },
      sectionLabelStyles: {
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#94A3B8",
        display: "block",
        mb: 1.25,
      },
    },
  },
});
