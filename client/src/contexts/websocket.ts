import { createContext } from 'react'
import useWebsocket from '../hooks/usewebsocket'

/**
 * We want to offer a way to use a single websocket connection to we
 * make a Context type of the result of the useWebsocket hook
 */
const WebSocketContext = createContext<ReturnType<typeof useWebsocket>>(
  undefined as any,
)

export default WebSocketContext
