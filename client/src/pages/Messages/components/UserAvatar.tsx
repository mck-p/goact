import React from 'react'
import styled from '@emotion/styled'
import { Avatar, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { MessageTimestamp } from './styled'

const Wrap = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  flex-grow: 0;
  justify-content: space-between;
`

const ImageAndName = styled.div`
  display: flex;
  flex-grow: 0;
  align-items: center;
`

const Img = styled(Avatar)`
  margin-right: 1.25rem;
`

interface Props {
  url: string
  name: string
  date: string
}

const UserAvatar = ({ url, name, date }: Props) => (
  <Wrap>
    <ImageAndName>
      <Img
        src={url}
        alt={name}
        title={name}
        style={{ width: '32px', height: '32px' }}
      />
      <Typography variant="caption">{name}</Typography>
    </ImageAndName>
    <MessageTimestamp dateTime={date}>
      <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
        {formatDistanceToNow(new Date(date), {
          addSuffix: true,
        })}
      </Typography>
    </MessageTimestamp>
  </Wrap>
)

export default UserAvatar
