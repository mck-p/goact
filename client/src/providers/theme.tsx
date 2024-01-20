import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const Provider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <>
      {children}
      <CssBaseline />
    </>
  </ThemeProvider>
)

export default Provider
