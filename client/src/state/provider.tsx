import React from 'react'
import { Provider } from 'react-redux'

import store from './store'

/**
 * State holds the _global_ state of the application via redux
 */
const State = ({ children }: { children: React.ReactElement }) => (
  <Provider store={store}>{children}</Provider>
)

export default State
