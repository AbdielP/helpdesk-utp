import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    text: {
      primary: "#424242",
      secondary: "#616161",
    },
    background: {
      default: "#EDEDED",
      paper: "#F3F3F3",
    },
    primary: {
      main: "#681A5D",
      hover: "#7a4473",
    },
    warning: {
      main: "#D28A1E",
    },
    info: {
      main: "#3F7AE0",
    },
    success: {
      main: "#2FA36B",
    },
    error: {
      main: "#D34F5C",
    },
  },
  custom: {
    colors: {
      priorities: {
        Alta: { bg: "#FDECEE", color: "#C43D4B", border: "#F6C7CD" },
        Media: { bg: "#FFF6E8", color: "#B96C00", border: "#F4D29A" },
        Baja: { bg: "#EAF8F1", color: "#1E8A57", border: "#B9E7CF" },
      },
      statuses: {
        Abierto: "#3F7AE0",
        "En proceso": "#D28A1E",
        Cerrado: "#2FA36B",
      },
      categories: {
        Plataforma: "#6C63D9",
        Cuenta: "#C0528C",
        Hardware: "#1FA7A0",
        Red: "#718096",
        Software: "#D47A2C",
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
