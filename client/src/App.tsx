import React from 'react'
import { Switch, Route, Redirect } from 'wouter'

import Signup from './pages/Signup'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import NotFound from './errors/NotFound'
import * as Communities from './pages/Communities'

import TopBar from './components/TopBar'
import PageMeta from './components/PageMeta'
import useConnectedAuthUser from './hooks/useConnectedAuthUser'

/**
 * This is the entrypoint to our business logic. Above this will be
 * any data, state, theming, etc global components and below this will
 * be any views, forms, etc business components
 */
const App = () => {
  useConnectedAuthUser()
  return (
    <>
      <PageMeta />
      <TopBar />
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={SignIn} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/messages" component={Messages} />
        <Route path="/communities" component={Communities.List} />
        <Route path="/communities/create" component={Communities.Create} />

        <Route component={NotFound} />
      </Switch>
    </>
  )
}

export default App
