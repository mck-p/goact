import React from 'react'
import { Router as BrowserRouter } from 'wouter'

/**
 * The way we interface with the browser's history API
 * and the URL bar
 */
const Router = ({ children }: { children: React.ReactElement }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

export default Router
