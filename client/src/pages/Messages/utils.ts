import { WebSocketMessage } from '../../hooks/usewebsocket'
import { Message } from '../../services/messages.schema'

export const mapDatabaseToWebsocket = (dbMessages: Message) => ({
  action: '@@MESSAGE/RECEIVE',
  payload: {
    message: dbMessages.message,
    receiverId: dbMessages.group_id,
  },
  metadata: {
    authorId: dbMessages.author_id,
    receivedAt: dbMessages.created_at,
  },
  id: dbMessages._id,
})

export const sortMessages = (a: WebSocketMessage, b: WebSocketMessage) => {
  if (a.metadata.receivedAt > b.metadata.receivedAt) {
    return 1
  }

  if (a.metadata.receivedAt < b.metadata.receivedAt) {
    return -1
  }

  return 0
}
