import { useState, useEffect, useCallback } from 'react'
import { useSession } from '@clerk/clerk-react'
import { Lens } from 'monocle-ts'
import Log from '../../log'
import { useDispatch } from 'react-redux'

export interface WebSocketMessage {
  action: string
  payload: any
  metadata: any
}

const generateHelloMessage = () => ({
  action: '@@INTERNAL/HELLO',
  payload: {},
  metadata: {},
})

export const MessageLens = Lens.fromProp<WebSocketMessage>()
export const ActionLens = MessageLens('action')
export const PayloadLens = MessageLens('payload')
export const MetadataLens = MessageLens('metadata')

export const assignSentAt = MetadataLens.modify((metadata = {}) => ({
  ...metadata,
  sentAt: new Date().toISOString(),
}))

export const assignReceivedAt = MetadataLens.modify((metadata = {}) => ({
  ...metadata,
  receivedat: new Date().toISOString(),
}))

export const encode = (msg: WebSocketMessage) => JSON.stringify(msg)
export const decode = (msg: string) => JSON.parse(msg)
/**
 * Used to interact with a Websocket at the given connection, using
 * any custom Sec-Websocket-Protocol headers
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism
 *
 * Uses the Clerk Session in order to attach Authentication <token> header
 * within the connection. This is used by the Goact Websocket logic to authenticate
 * the incoming request for a stateful websocket connection. Any websocket you
 * connect to with this will need to implement, or at least allow for, this protocol
 */
const useWebsocket = (connStr: string, ...headers: string[]) => {
  const { session } = useSession()
  const dispatch = useDispatch()
  const [conn, setConn] = useState<WebSocket>()
  const [lastMessage, setLastMessage] = useState<WebSocketMessage>()

  /**
   * When we send a message, we will also dispatch that message
   * into redux, using some internal mapping of Command -> Redux Action
   */
  const sendMessage = useCallback(
    (msg: WebSocketMessage) => {
      if (conn && conn.OPEN) {
        /**
         * We are dispatching _before_ we send because
         * we want to allow for optomistic rendering
         */
        const outgoingMessage = assignSentAt(msg)

        dispatch({
          type: outgoingMessage.action,
          payload: outgoingMessage.payload,
          metadata: outgoingMessage.metadata,
        })

        conn.send(encode(outgoingMessage))
      } else {
        Log.warn(
          { msg },
          'Trying to send a message before a connection is open',
        )
      }
    },
    [conn],
  )

  const close = useCallback(() => {
    conn?.close()
  }, [conn])

  useEffect(() => {
    const connect = async () => {
      Log.info({ connStr }, 'Connecting to websocket')

      if (!conn && session) {
        const token = await session.getToken()

        if (!token) {
          return
        }

        /**
         * We are setting a Sec-Websocket-Protocol
         * of Authentication so that the server can
         * authenticate us at the beginning of the session
         */
        const connection = new WebSocket(connStr, [
          'Authentication',
          token,
          ...headers,
        ])

        connection.addEventListener('message', (msg) => {
          try {
            /**
             * We add onto the metadata we are getting some value
             * to tell ourselves when we were told about this message
             */
            const incomingMessage = assignReceivedAt(decode(msg.data))

            Log.trace({ message: incomingMessage }, 'Handling incoming message')

            return setLastMessage(incomingMessage)
          } catch (err) {
            Log.warn({ err }, 'Error parsing incoming message')
          }
        })

        connection.addEventListener('open', () => {
          // once we are open, send a hello message
          connection.send(encode(generateHelloMessage()))
          // and reset our retry counter
        })

        connection.addEventListener('close', () => {
          setTimeout(connect, 1000)
        })

        setConn(connection)
      }
    }

    connect()

    return () => {
      Log.info('we are closing connection to websocket')
      conn?.close()
    }
  }, [conn, session])

  return {
    conn,
    sendMessage,
    lastMessage,
    close,
    connected: !!conn,
  }
}

export default useWebsocket
