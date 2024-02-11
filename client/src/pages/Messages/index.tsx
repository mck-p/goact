import React, { useCallback, useEffect, useState } from 'react'
import { Divider, Typography } from '@mui/material'

import Log from '../../log'
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

import {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useGetMessagesForGroupQuery,
} from '../../state/domains/messages'
import { useSelector } from 'react-redux'
import { RootState } from '../../state/store'
import { sortMessages } from './utils'

const Messages = () => {
  const { selectedGroup, sendMessage, user, session, setSelectedGroup } =
    useGroupMessages()

  const { data: messages = [] } = useGetMessagesForGroupQuery(
    selectedGroup?._id || '',
  )
  const [currentMessageState, setCurrentMessageState] = useState<
    string | undefined
  >()

  const { data: groups = [] } = useGetGroupsQuery(undefined)
  const [createGroup, newlyCreatedGroup]: any = useCreateGroupMutation()

  useEffect(() => {
    if (groups.length && !selectedGroup) {
      setSelectedGroup(groups[0])
    }
  }, [groups, selectedGroup])

  useEffect(() => {
    if (newlyCreatedGroup.isSuccess) {
      setSelectedGroup(newlyCreatedGroup.data)
    }
  }, [newlyCreatedGroup, setSelectedGroup])

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

            const messageGroup = await createGroup(name).unwrap()

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
            {Array.from(messages)
              .sort(sortMessages)
              .map((message, i) => (
                <MessageWrap key={message._id}>
                  <Message
                    authorId={message.author_id}
                    receivedAt={message.created_at}
                    message={message.message}
                  />
                  {i !== 0 ? <Divider /> : null}
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

const OnlyAuthenticatedMessages = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return null
  }

  return <Messages />
}

export default OnlyAuthenticatedMessages
