import React from 'react'
import { TextField } from '@mui/material'
import styled from '@emotion/styled'

const Input = styled(TextField)`
  max-width: 95%;
  margin: 0 auto;
  margin-top: 4rem;
`

interface Props {
  handleUpdate: (value: any) => void
  onSend: () => void
  currentValue: any
}

const MessageInput = ({ handleUpdate, onSend, currentValue = '' }: Props) => (
  <Input
    label="Message"
    name="message"
    multiline
    value={currentValue}
    onChange={handleUpdate}
    variant="filled"
    onKeyUp={(event) => {
      if (event.key.toLowerCase() == 'enter') {
        if (event.shiftKey) {
          //
        } else {
          onSend()
        }
      }
    }}
    fullWidth
  />
)

export default MessageInput
