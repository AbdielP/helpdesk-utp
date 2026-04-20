import MuiButton from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

const Button = ({ appearance = "primary", sx = [], children, ...props }) => {
  const theme = useTheme();

  const primaryStyles = {
    textTransform: "none",
    fontWeight: 600,
    borderRadius: "10px",
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: theme.palette.primary.hover,
    },
    "&.Mui-disabled": {
      backgroundColor: "#D7CDD5",
      color: "#F8F4F7",
    },
  };

  const secondaryStyles = {
    textTransform: "none",
    fontWeight: 500,
    borderRadius: "10px",
    borderColor: "#D5D1DA",
    color: theme.palette.text.secondary,
    "&:hover": {
      borderColor: "#BBB4C3",
      backgroundColor: "transparent",
    },
  };

  const appearanceStyles =
    appearance === "secondary" ? secondaryStyles : primaryStyles;

  return (
    <MuiButton
      variant={appearance === "secondary" ? "outlined" : "contained"}
      disableElevation
      sx={[appearanceStyles, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
