import { useState, useEffect } from 'react'
import { useUser as useClerkUser, useSession } from '@clerk/clerk-react'

import { getUserByExternalId } from '../services/user'
import Log from '../log'

interface User {
  id: string
  externalId: string
}

interface ClerkUser {
  id: string
}

interface ClerkSession {
  getToken: () => Promise<string | null>
}

interface ClerkToDatabaseRequest {
  setUser(user: User): void
  clerkUser: ClerkUser
  session: ClerkSession
}

const getDatabaseUser = async (req: ClerkToDatabaseRequest): Promise<void> => {
  const token = await req.session?.getToken()

  if (!token) {
    Log.warn(
      { externalId: req.clerkUser.id },
      'Could not get a token from the session',
    )
    return
  }

  const { user: dbUser } = await getUserByExternalId(req.clerkUser.id, token)
  const user = {
    id: dbUser._id,
    externalId: dbUser.externalId,
  }

  Log.info({ user }, 'Got user from database')

  req.setUser(user)
}

export const useUser = () => {
  const { user } = useClerkUser()
  const { session } = useSession()
  const [uiUser, setUIUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    if (user && session) {
      getDatabaseUser({
        clerkUser: user,
        setUser: setUIUser,
        session,
      })
    }
  }, [user, setUIUser, session])

  return {
    user: user && uiUser,
  }
}

export default useUser
