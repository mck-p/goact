import { useSession } from '@clerk/clerk-react'
import { useState, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import WebSocketContext from '../contexts/websocket'
import { MessageGroup } from '../services/messages.schema'

import useUser from './useuser'
import { manuallySetMessageInState } from '../state/domains/messages'

const useGroupMessages = () => {
  const [groups, setGroups] = useState<MessageGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<MessageGroup>()

  const { sendMessage, lastMessage } = useContext(WebSocketContext)
  const { user } = useUser()
  const { session } = useSession()
  const dispatch = useDispatch()

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.action === '@@SERVER-SENT/@@MESSAGES/SEND') {
        dispatch(
          manuallySetMessageInState({
            _id: lastMessage.id,
            message: lastMessage.payload.message,
            created_at: lastMessage.metadata.receivedAt,
            author_id: lastMessage.metadata.authorId,
            group_id: lastMessage.payload.groupId,
            sent_at: lastMessage.metadata.receivedAt,
          }) as any,
        )
      }
    }
  }, [lastMessage])

  return {
    groups,
    sendMessage,
    setSelectedGroup,
    selectedGroup,
    user,
    session,
    setGroups,
  }
}

export default useGroupMessages
