import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Redirect } from 'wouter'

const OnlyAuthenticated =
  (Component: React.JSXElementConstructor<any>) => (props: any) => {
    const { isSignedIn, isLoaded } = useUser()

    if (!isLoaded) {
      return null
    }

    if (!isSignedIn) {
      return <Redirect to="/signup" />
    }

    return <Component {...props} />
  }

export default OnlyAuthenticated
