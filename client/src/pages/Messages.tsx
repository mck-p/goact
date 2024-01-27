import React, { useContext, useEffect, useState } from 'react'
import { Button, Paper, TextField, Typography } from '@mui/material'
import styled from '@emotion/styled'
import useWebsocket, { WebSocketMessage } from '../hooks/usewebsocket'
import Log from '../log'
import { useSession } from '@clerk/clerk-react'
import WebSocketContext from '../contexts/websocket'

const Page = styled.main`
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
`

const MessageList = styled(Paper)`
  width: 95%;
  padding: 1.5rem;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  flex-flow: column-reverse;
`

const Form = styled.form`
  width: 95%;
  max-width: 1440px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;

  .MuiFormControl-root {
    margin-bottom: 2rem;
  }
`

const Profile = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const { sendMessage, lastMessage } = useContext(WebSocketContext)

  useEffect(() => {
    if (lastMessage) {
      setMessages((msgs) => [...msgs, lastMessage])
    }
  }, [lastMessage])

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target as any)
    const action = formData.get('action') as string
    const payloadStr = formData.get('payload') as string
    const metadataStr = formData.get('metadata') as string

    if (!action) {
      Log.warn(
        { action, payloadStr, metadataStr },
        'Missing required message arguments',
      )
      return
    }

    if (!payloadStr) {
      Log.warn(
        { action, payloadStr, metadataStr },
        'Missing required message arguments',
      )
      return
    }

    if (!metadataStr) {
      Log.warn(
        { action, payloadStr, metadataStr },
        'Missing required message arguments',
      )

      return
    }

    let payload, metadata

    try {
      payload = JSON.parse(payloadStr)
      metadata = JSON.parse(payloadStr)
    } catch (e) {
      Log.warn(
        { err: e, payloadStr, metadataStr },
        'Error parsing payload or metadata ',
      )

      return
    }

    sendMessage({
      action,
      payload,
      metadata,
    })

    const form = e.target as any

    form.reset()
  }

  return (
    <Page>
      <Typography variant="h2">Messages</Typography>
      <MessageList>
        {messages
          .filter(({ action }) => !action.includes('@@INTERNAL'))
          .map((message, i) => (
            <div key={i}>
              Action: {message.action} <br />
              Payload: {JSON.stringify(message.payload)} <br />
              Metadata: {JSON.stringify(message.metadata)} <br />
            </div>
          ))}
      </MessageList>
      <Form onSubmit={handleFormSubmit}>
        <TextField label="Action Name" type="text" name="action" />
        <TextField label="JSON Payload" name="payload" multiline minRows={10} />
        <TextField
          label="JSON Metadata"
          name="metadata"
          multiline
          minRows={10}
        />

        <Button type="submit">Send</Button>
        <Button type="reset">Clear</Button>
      </Form>
    </Page>
  )
}

export default Profile
