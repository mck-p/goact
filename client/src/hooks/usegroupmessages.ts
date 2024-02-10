import { useUser, useSession } from '@clerk/clerk-react'
import { useState, useContext, useEffect } from 'react'
import WebSocketContext from '../contexts/websocket'
import { mapDatabaseToWebsocket, sortMessages } from '../pages/Messages/utils'
import {
  getMessageGroupsForUser,
  getMessageForGroup,
} from '../services/messages'
import { MessageGroup } from '../services/messages.schema'
import { WebSocketMessage } from './usewebsocket'

import Log from '../log'

const useGroupMessages = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [groups, setGroups] = useState<MessageGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<MessageGroup>()

  const { sendMessage, lastMessage } = useContext(WebSocketContext)
  const { user } = useUser()
  const { session } = useSession()

  useEffect(() => {
    const getGroups = async () => {
      const token = await session?.getToken()

      if (token) {
        try {
          const result = await getMessageGroupsForUser(token)

          setGroups(result)
        } catch (err) {
          Log.warn({ err }, 'Error getting message groups')
        }
      }
    }

    if (session) {
      getGroups()
    }
  }, [session])

  useEffect(() => {
    if (lastMessage) {
      setMessages((msgs) => [...msgs, lastMessage])
    }
  }, [lastMessage])

  useEffect(() => {
    const getPastMessages = async () => {
      const token = await session?.getToken()

      if (token && selectedGroup?._id) {
        try {
          const result = await getMessageForGroup(selectedGroup?._id, token)

          const mapped: WebSocketMessage[] = result.map(mapDatabaseToWebsocket)

          setMessages(() => {
            return mapped.sort(sortMessages)
          })
        } catch (err) {
          Log.warn({ err }, 'Error when trying to get messages')
        }
      } else {
        setMessages([])
      }
    }

    if (session && user) {
      getPastMessages()
    }
  }, [user, setMessages, selectedGroup?._id, session])

  return {
    messages,
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
