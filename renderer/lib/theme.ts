import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const theme = createTheme({
  palette: {
    primary: {
      main: "#6d4c41",
      light: "#9c786c",
      dark: "#40241a",
    },
    secondary: {
      main: "#fb8c00",
      light: "#ffbd45",
      dark: "#c25e00",
    },
    background: {
      default: "#F5F5F5",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});
