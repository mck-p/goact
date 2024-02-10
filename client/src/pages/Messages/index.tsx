import React, { useCallback, useEffect, useState } from 'react'
import { Button, Divider, TextField, Typography } from '@mui/material'

import Log from '../../log'
import { createMessageGroup } from '../../services/messages'
import GroupSelector from './components/GroupSelector'
import GroupCreator from './components/GroupCreator'
import useGroupMessages from '../../hooks/usegroupmessages'
import {
  GroupSelectAndInput,
  MessageList,
  MessageScreen,
  MessageWrap,
  MessagesAndInput,
  Page,
} from './components/styled'
import Message from './components/Message'
import MessageInput from './components/MessageInput'

const Messages = () => {
  const {
    selectedGroup,
    sendMessage,
    user,
    session,
    setGroups,
    setSelectedGroup,
    messages,
    groups,
  } = useGroupMessages()

  const [currentMessageState, setCurrentMessageState] = useState<
    string | undefined
  >()

  useEffect(() => {
    if (groups.length && !selectedGroup) {
      setSelectedGroup(groups[0])
    }
  }, [groups, selectedGroup])

  const handleSendMessage = useCallback(() => {
    if (user && selectedGroup?._id && currentMessageState) {
      try {
        sendMessage({
          action: '@@MESSAGES/SAVE',
          payload: {
            groupId: selectedGroup?._id,
            message: currentMessageState,
          },
          metadata: {
            authorId: user.id,
          },
          id: window.crypto.randomUUID(),
        })
      } catch (err) {
        Log.warn({ err }, 'Error sending new message')
      }
    }

    setCurrentMessageState(undefined)
  }, [user, selectedGroup, currentMessageState])

  const createNewGroup = useCallback(
    async (e: any) => {
      e.preventDefault()
      if (session) {
        const token = await session.getToken()

        if (token) {
          try {
            const formData = new FormData(e.target)
            const name = formData.get('name') as string

            const messageGroup = await createMessageGroup(name, token)
            setGroups((old) => [...old, messageGroup])
            setSelectedGroup(messageGroup)
          } catch (err) {
            Log.warn({ err }, 'Error when trying to create a message group')
          } finally {
            e.target.reset()
          }
        }
      }
    },
    [session],
  )

  const displayMessages = messages.filter(
    ({ action }) => !action.includes('@@INTERNAL'),
  )

  if (!user) {
    Log.warn("We should have a user here but we don't!")
  }

  return (
    <Page>
      <Typography variant="h2" gutterBottom>
        Messages
      </Typography>
      <MessageScreen>
        <GroupSelectAndInput>
          <GroupSelector
            selectedGroupId={selectedGroup?._id || ''}
            groups={groups}
            setSelectedGroup={setSelectedGroup}
          />
          <GroupCreator createNewGroup={createNewGroup} />
        </GroupSelectAndInput>
        <MessagesAndInput>
          <MessageList>
            {displayMessages.map((message, i) => (
              <MessageWrap key={message.id}>
                <Message {...message} />
                {i !== displayMessages.length - 1 ? <Divider /> : null}
              </MessageWrap>
            ))}
          </MessageList>
          <MessageInput
            currentValue={currentMessageState}
            handleUpdate={(event) => {
              setCurrentMessageState(event.target.value)
            }}
            onSend={handleSendMessage}
          />
        </MessagesAndInput>
      </MessageScreen>
    </Page>
  )
}

export default Messages
