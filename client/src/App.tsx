import React, { useEffect } from 'react'
import { Switch, Route } from 'wouter'

import Signup from './pages/Signup'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import * as Communities from './pages/Communities'

import TopBar from './components/TopBar'
import PageMeta from './components/PageMeta'
import { useSession } from '@clerk/clerk-react'

const AuthenticatedRoutes = () => {
  const { session } = useSession()

  if (!session) {
    return (
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={SignIn} />
      </Switch>
    )
  }

  return (
    <>
      <TopBar />
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/messages" component={Messages} />
        <Route path="/communities" component={Communities.List} />
        <Route path="/communities/create" component={Communities.Create} />
        <Route
          path="/communities/:community_id/members/:member_id"
          component={Communities.Member}
        />
        <Route path="/communities/:id" component={Communities.Single} />
      </Switch>
    </>
  )
}

/**
 * This is the entrypoint to our business logic. Above this will be
 * any data, state, theming, etc global components and below this will
 * be any views, forms, etc business components
 */
const App = () => {
  return (
    <>
      <PageMeta />
      <AuthenticatedRoutes />
    </>
  )
}

export default App
