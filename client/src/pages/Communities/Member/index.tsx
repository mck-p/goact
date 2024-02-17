import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../state/store'

import { Typography } from '@mui/material'
import { useParams } from 'wouter'
import { useTranslation } from 'react-i18next'

import {
  CommunityMemberAvatarLens,
  CommunityMemberComfortItemsLens,
  CommunityMemberIdLens,
  CommunityMemberNameLens,
  useGetCommunityMemberQuery,
} from '../../../state/domains/communities'

import { Page, Avatar, Profile, Lists } from './components/styled'
import ComfortList from './components/ComfortList'

const CommunityMember = () => {
  const params = useParams()
  const { t: translations } = useTranslation()

  const { data } = useGetCommunityMemberQuery({
    community: params.community_id!,
    member: params.member_id!,
  })

  if (!data) {
    return null
  }

  const member = {
    avatar: CommunityMemberAvatarLens.get(data),
    name: CommunityMemberNameLens.get(data),
    comfortItems: CommunityMemberComfortItemsLens.get(data) || [],
    id: CommunityMemberIdLens.get(data),
  }

  return (
    <Page>
      <Profile elevation={2}>
        <Avatar src={member.avatar} alt={member.name} />
        <Typography variant="h2" gutterBottom>
          {member.name}
        </Typography>
        <Lists>
          <ComfortList items={member.comfortItems} memberId={member.id} />
        </Lists>
      </Profile>
    </Page>
  )
}

const OnlyAuthenticatedCommunityMember = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return null
  }

  return <CommunityMember />
}

export default OnlyAuthenticatedCommunityMember
