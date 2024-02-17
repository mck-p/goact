import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../state/store'

const OnlyRenderWhenAuthenticated = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return null
  }

  return children
}

export default OnlyRenderWhenAuthenticated
