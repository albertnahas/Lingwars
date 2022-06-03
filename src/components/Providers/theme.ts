import { createTheme } from "@mui/material"
import { TypographyStyleOptions } from "@mui/material/styles/createTypography"
import { CSSProperties } from "react"

const fontSize = 18
const fontFamily = "'Calibri', 'Carlito', sans-serif"
const htmlFontSize = 18
const fontWeightLight = 300
const fontWeightRegular = 400
const fontWeightBold = 700

const caseAllCaps: Record<"textTransform", CSSProperties["textTransform"]> = {
  textTransform: "uppercase",
}
const coef = fontSize / 18
const pxToRem = (size: number) => `${(size / htmlFontSize) * coef}rem`
function round(value: number) {
  return Math.round(value * 1e5) / 1e5
}
const buildVariant = (
  fontWeight: CSSProperties["fontWeight"],
  size: number,
  lineHeight: number,
  letterSpacing: number,
  casing?: Pick<CSSProperties, "textTransform">
): TypographyStyleOptions => ({
  fontFamily,
  fontWeight,
  fontSize: pxToRem(size),
  // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
  lineHeight,
  // The letter spacing was designed for the Roboto font-family. Using the same letter-spacing
  // across font-families can cause issues with the kerning.
  letterSpacing: `${round(letterSpacing / size)}em`,
  ...casing,
})

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    background: {
      default: "#0000",
    },
    common: {
      black: "#232323",
      white: "#fff",
    },
    error: { main: "#F2616D" },
    grey: {
      100: "#efefef",
      200: "#EFEFEF",
      300: "#b7b7b7",
      400: "#787878",
      500: "#232323",
    },
    info: { main: "#619DF2" },
    primary: {
      main: "#C31924",
    },
    success: { main: "#43BF58" },
    warning: { main: "#F2CE61" },
  },
  shape: {
    borderRadius: 3,
  },
  typography: {
    fontFamily: fontFamily,
    fontSize: fontSize,
    h1: buildVariant(fontWeightRegular, 68, 1, -1.5),
    h2: buildVariant(fontWeightRegular, 54, 1, -0.5),
    h3: buildVariant(fontWeightRegular, 42, 1.1, 0),
    h4: buildVariant(fontWeightRegular, 32, 1.1, 0.25),
    h5: buildVariant(fontWeightRegular, 26, 1.1, 0),
    h6: buildVariant(fontWeightRegular, 22, 1.1, 0.15),
    subtitle1: buildVariant(fontWeightLight, 20, 1.1, 0.15),
    subtitle2: buildVariant(fontWeightLight, 14, 1.57, 0.1),
    body1: buildVariant(fontWeightRegular, 18, 1.2, 0.15),
    body2: buildVariant(fontWeightRegular, 14, 1.2, 0.15),
    button: buildVariant(fontWeightBold, 18, 1, 0.4, caseAllCaps),
    caption: buildVariant(fontWeightRegular, 12, 1, 0.4),
    overline: buildVariant(fontWeightRegular, 12, 2.66, 1),
  },
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
})

theme.typography.pxToRem = pxToRem

theme.typography.h1 = {
  ...theme.typography.h1,
  [theme.breakpoints.down("md")]: {
    fontSize: 60,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 48,
  },
}

theme.typography.h2 = {
  ...theme.typography.h2,
  [theme.breakpoints.down("md")]: {
    fontSize: 48,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 42,
  },
}

theme.typography.h3 = {
  ...theme.typography.h3,
  [theme.breakpoints.down("md")]: {
    fontSize: 36,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 32,
  },
}

theme.typography.h4 = {
  ...theme.typography.h4,
  [theme.breakpoints.down("md")]: {
    fontSize: 28,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 26,
  },
}

theme.typography.h5 = {
  ...theme.typography.h5,
  [theme.breakpoints.down("md")]: {
    fontSize: 24,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 22,
  },
}

theme.typography.h6 = {
  ...theme.typography.h6,
  [theme.breakpoints.down("md")]: {
    fontSize: 20,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 18,
  },
}

theme.typography.body1 = {
  ...theme.typography.body1,
  [theme.breakpoints.down("md")]: {
    fontSize: 16,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
  },
}

theme.typography.body2 = {
  ...theme.typography.body2,
  [theme.breakpoints.down("md")]: {
    fontSize: 13,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 12,
  },
}

theme.typography.caption = {
  ...theme.typography.caption,
  [theme.breakpoints.down("md")]: {
    fontSize: 11,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 10,
  },
}

theme.typography.button = {
  ...theme.typography.button,
  [theme.breakpoints.down("lg")]: {
    fontSize: 15,
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: 18,
  },
}

export default theme
