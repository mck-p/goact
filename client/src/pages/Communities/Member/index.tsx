import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../state/store'

import { Typography } from '@mui/material'
import { useParams } from 'wouter'

import {
  CommunityMemberAvatarLens,
  CommunityMemberComfortItemsLens,
  CommunityMemberIdLens,
  CommunityMemberNameLens,
  CommunityMemberProfile,
  useGetCommunityMemberQuery,
  useUpdateCommunityMemberProfileMutation,
} from '../../../state/domains/communities'

import { Page, Avatar, Profile, Lists } from './components/styled'
import ComfortList from './components/ComfortList'

const CommunityMember = () => {
  const params = useParams()

  const { data } = useGetCommunityMemberQuery({
    community: params.community_id!,
    member: params.member_id!,
  })

  const [updateProfile] = useUpdateCommunityMemberProfileMutation()

  const updateMeberProfile = useCallback(
    (newValues: Partial<CommunityMemberProfile>) => {
      if (data) {
        updateProfile({
          communityId: data.community,
          memberId: data.member,
          ...data.profile,
          ...newValues,
        })
      }
    },
    [data],
  )

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
          <ComfortList
            items={member.comfortItems}
            memberId={member.id}
            setNewItems={(cb) => {
              const newComfortListItems = cb(member.comfortItems)

              updateMeberProfile({
                comfortItems: newComfortListItems,
              })
            }}
          />
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
