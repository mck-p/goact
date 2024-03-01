import React, { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { usePostFeedItemMutation } from '../../../../state/domains/communities'
import { useSession } from '@clerk/clerk-react'

const Form = styled.form`
  width: 100%;
  margin: 0 auto;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  align-items: center;
`

interface Props {
  communityId: string
}

const FeedItemFormInput = ({ type }: { type: string }) => {
  if (type === 'text') {
    return (
      <TextField
        name="message"
        label="What's on your mind?"
        fullWidth
        multiline
        minRows={4}
        sx={{ marginBottom: '1.5rem' }}
      />
    )
  }

  if (type === 'date') {
    return (
      <div style={{ width: '100%' }}>
        <DatePicker
          name="date"
          defaultValue={dayjs(new Date().toISOString())}
          sx={{ flexGrow: 1, width: '100%', marginBottom: '1.5rem' }}
        />
        <TextField
          name="message"
          label="What are we planning?"
          fullWidth
          multiline
          minRows={4}
          sx={{ marginBottom: '1.5rem' }}
        />
      </div>
    )
  }

  return null
}

const FeedItemForm = ({ communityId }: Props) => {
  const [submit] = usePostFeedItemMutation()
  const { session } = useSession()
  const [selectedType, setSelectedType] = useState<string>('text')

  const handleFormSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault()
      if (session) {
        const token = await session.getToken()
        if (token) {
          const formData = new FormData(e.target as any)
          const body = {
            type: 'text',
            data: {
              message: formData.get('message'),
            },
          }

          const request = {
            communityId,
            token,
            item: body,
          }

          submit(request)
          ;(e.target as any).reset()
          setSelectedType('text')
        }
      }
    },
    [session],
  )

  return (
    <Form onSubmit={handleFormSubmit}>
      <FormControl fullWidth sx={{ marginBottom: '1.5rem' }}>
        <InputLabel htmlFor="type">Type</InputLabel>
        <Select
          name="type"
          id="type"
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value as string)}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
      </FormControl>
      <FeedItemFormInput type={selectedType} />
      <Button type="submit" variant="contained">
        Share with Community
      </Button>
    </Form>
  )
}

export default FeedItemForm
