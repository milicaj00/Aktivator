import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
        main: "#C53525",
        contrastText: "white",
        light: "white",
    },
    secondary: {
        main: "#323432",
        contrastText: "white",
    },
    error: {
      main: "#f83200",
    },
  },
});
