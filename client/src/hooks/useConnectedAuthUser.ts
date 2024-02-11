import { useSession } from '@clerk/clerk-react'
import { useDispatch } from 'react-redux'
import { setToken } from '../state/domains/auth'
import { useEffect } from 'react'

const useConnectedAuthUser = () => {
  const { session } = useSession()
  const dispatch = useDispatch()

  useEffect(() => {
    if (session) {
      session.getToken().then((token) => token && dispatch(setToken(token)))
    }
  }, [session])
}

export default useConnectedAuthUser
