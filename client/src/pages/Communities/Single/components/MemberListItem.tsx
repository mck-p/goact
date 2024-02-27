import React from 'react'

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from '@mui/material'

import { Link } from 'wouter'

import styled from '@emotion/styled'

import {
  CommunityMember,
  CommunityMemberAvatarLens,
  CommunityMemberCommunityIDLens,
  CommunityMemberIdLens,
  CommunityMemberNameLens,
} from '../../../../state/domains/communities'

const Member = styled(Link)`
  color: inherit;
  text-decoration: none;
`

interface Props {
  member: CommunityMember
}

const MemberListItem = ({ member }: Props) => {
  const name = CommunityMemberNameLens.get(member)
  const avatar = CommunityMemberAvatarLens.get(member)
  const communityId = CommunityMemberCommunityIDLens.get(member)
  const memberId = CommunityMemberIdLens.get(member)

  return (
    <Member href={`/communities/${communityId}/members/${memberId}`}>
      <ListItemButton>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt={name} src={avatar} />
          </ListItemAvatar>
          <ListItemText primary={name} />
        </ListItem>
      </ListItemButton>
    </Member>
  )
}

export default MemberListItem
