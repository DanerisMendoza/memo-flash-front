import { createTheme } from "@mui/material";

export default function themeDeck() {
  return createTheme({
    palette: {
      primary: {
        main: "rgba(0, 0, 0, 0.8)", // Black with 80% opacity
      },
      secondary: {
        main: "rgba(0, 0, 255, 0.8)", // Blue with 80% opacity
      },
    },
  });
}
