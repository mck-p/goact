import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import WebSocketContext from '../contexts/websocket'
import useWebsocket from '../hooks/usewebsocket'

/**
 * We want to allow for a single websocket connection that interacts with
 * the Redux store so we are creating a provider that must be used within
 * the ReduxProvider tree. This will connect to the websocket and then
 * dispatch any actions coming over the wire into the Redux action to
 * be processed, if need by, by the store
 */
const ReduxWebSocket = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const result = useWebsocket('ws://localhost:8080/ws')

  useEffect(() => {
    if (result.lastMessage) {
      dispatch({
        type: result.lastMessage.action,
        payload: result.lastMessage.payload,
        metadata: result.lastMessage.metadata,
      })
    }
  }, [result.lastMessage])

  return (
    <WebSocketContext.Provider value={result}>
      {children}
    </WebSocketContext.Provider>
  )
}

export default ReduxWebSocket
