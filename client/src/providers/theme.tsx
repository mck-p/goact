import React from 'react'
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#3F51B5',
        dark: '#303F9F',
      },
      secondary: {
        main: '#FF5722',
      },
    },
  }),
)

const Provider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <>
      {children}
      <CssBaseline />
    </>
  </ThemeProvider>
)

export default Provider
