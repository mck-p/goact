import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { Button, TextField } from '@mui/material'
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

const FeedItemForm = ({ communityId }: Props) => {
  const [submit] = usePostFeedItemMutation()
  const { session } = useSession()
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
              message: formData.get('body'),
            },
          }

          const request = {
            communityId,
            token,
            item: body,
          }

          submit(request)

          ;(e.target as any).reset()
        }
      }
    },
    [session],
  )

  return (
    <Form onSubmit={handleFormSubmit}>
      <TextField
        name="body"
        label="What's on your mind?"
        fullWidth
        multiline
        minRows={4}
        sx={{ marginBottom: '1.5rem' }}
      />
      <Button type="submit" variant="contained">
        Share with Community
      </Button>
    </Form>
  )
}

export default FeedItemForm
