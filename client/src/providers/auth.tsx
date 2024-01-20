import React from 'react'
import { ClerkProvider } from '@clerk/clerk-react'

/**
 * This handles ensuring that we have authentication at a
 * global level
 */
const Auth = ({ children }: { children: React.ReactElement }) => (
  <ClerkProvider publishableKey={process.env.CLERK_KEY!}>
    {children}
  </ClerkProvider>
)

export default Auth
