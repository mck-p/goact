import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import Global from './providers/global'

// This is the startup script that does things
// before we want to start the React rendering
// engine, such as i18n, etc
import './init'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement!)

root.render(
  <Global>
    <App />
  </Global>,
)
