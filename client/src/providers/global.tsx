import React, { StrictMode } from 'react'
import Router from './router'
import Auth from './auth'
import Theme from './theme'
import ReduxWebSocket from './reduxWebsocket'
import Date from './Date'

import Catch from '../errors/Catch'
import State from '../state/provider'

/**
 * This is where the things that are _global_ to the application
 * like routing, state, authentication, etc, are rendered
 */
const Global = ({ children }: { children: React.ReactElement }) => (
  <StrictMode>
    <Catch
      fallback={
        <div>
          <h2>
            We messed up somewhere. Please give us grace and let us look into
            this!
          </h2>
        </div>
      }
    >
      <Auth>
        <State>
          <Date>
            <ReduxWebSocket>
              <Theme>
                <Router>{children}</Router>
              </Theme>
            </ReduxWebSocket>
          </Date>
        </State>
      </Auth>
    </Catch>
  </StrictMode>
)

export default Global
