import React, { useEffect } from 'react'
import { useSession } from '@clerk/clerk-react'
import styled from '@emotion/styled'

import {
  CommunityFeedItem,
  CommunityMemberAvatarLens,
  CommunityMemberIdLens,
  CommunityMemberNameLens,
  useLazyGetCommunityMemberQuery,
} from '../../../../state/domains/communities'
import { Avatar, Typography } from '@mui/material'

const Item = styled.aside`
  width: 90%;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`

type Props = CommunityFeedItem & {
  communityId: string
}

const FeedItem = (item: Props) => {
  const [getCommunityMember, communityMemberResult] =
    useLazyGetCommunityMemberQuery()

  const { session } = useSession()

  useEffect(() => {
    const doWork = async () => {
      if (session) {
        const token = await session.getToken()

        if (token) {
          getCommunityMember({
            community: item.communityId,
            member: item.author_id,
            token,
          })
        }
      }
    }

    if (session) {
      doWork()
    }
  }, [session])

  const data = communityMemberResult.currentData

  if (!data) {
    return 'Loading...'
  }

  const member: { [x: string]: any } = {
    avatar: CommunityMemberAvatarLens.get(data),
    name: CommunityMemberNameLens.get(data),
    id: CommunityMemberIdLens.get(data),
  }

  return (
    <Item>
      <header>
        <Avatar src={member.avatar} alt={member.name} />
        <Typography>{member.name}</Typography>
      </header>
      <main>
        <Typography component="div">{item.data.message as any}</Typography>
      </main>
    </Item>
  )
}

export default FeedItem
