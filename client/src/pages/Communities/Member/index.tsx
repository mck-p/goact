import React, { useCallback, useEffect } from 'react'

import { useParams } from 'wouter'

import {
  CommunityMemberAvatarLens,
  CommunityMemberIdLens,
  CommunityMemberNameLens,
  CommunityMemberProfile,
  lensForProfileKey,
  useLazyGetCommunityMemberQuery,
  useUpdateCommunityMemberProfileMutation,
} from '../../../state/domains/communities'

import { Page, Profile, ProfileItems } from './components/styled'
import { useUser } from '../../../hooks/useuser'
import MemberAvatar from './components/MemberAvatar'

import EditableProfifleItem from './components/EditableProfileItem'
import { PROFILE_ITEM_TYPE } from '../../../state/domains/communities'
import { useSession } from '@clerk/clerk-react'

const CommunityMember = () => {
  const { user } = useUser()
  const params = useParams()
  const { session } = useSession()

  const [getCommunityMember, communityMemberResult] =
    useLazyGetCommunityMemberQuery()

  const [updateProfile] = useUpdateCommunityMemberProfileMutation()

  const updateMemberProfile = useCallback(
    async (newValues: Partial<CommunityMemberProfile>) => {
      if (communityMemberResult.currentData && session) {
        const token = await session.getToken()
        if (token) {
          updateProfile({
            token,
            communityId: communityMemberResult.currentData.community,
            memberId: communityMemberResult.currentData.member,
            ...communityMemberResult.currentData.profile,
            ...newValues,
          })
        }
      }
    },
    [communityMemberResult.currentData, session],
  )

  useEffect(() => {
    const doWork = async () => {
      const token = await session?.getToken()

      if (token) {
        getCommunityMember({
          community: params.community_id!,
          member: params.member_id!,
          token,
        })
      }
    }

    if (session) {
      doWork()
    }
  }, [session])

  if (!communityMemberResult.currentData) {
    return null
  }

  const data = communityMemberResult.currentData

  const member: { [x: string]: any } = {
    avatar: CommunityMemberAvatarLens.get(data),
    name: CommunityMemberNameLens.get(data),
    id: CommunityMemberIdLens.get(data),
  }

  for (const item of Object.values(data.profile_schema)) {
    const lens = lensForProfileKey(item.name)
    member[item.name] = lens.get(data)
  }

  const canEdit = user?.id === member.id

  return (
    <Page>
      <Profile elevation={2}>
        <MemberAvatar
          communityId={data.community}
          memberId={data.member}
          url={member.avatar}
          name={member.name}
          canEdit={canEdit}
          updateAvatar={(url) =>
            updateMemberProfile({
              avatar: url,
            })
          }
        />
        <ProfileItems>
          {Object.values(data.profile_schema)
            .sort((a, b) => {
              if (a.index < b.index) {
                return -1
              }

              if (a.index > b.index) {
                return 1
              }

              return 0
            })
            .map((item) => (
              <EditableProfifleItem
                type={item.type as PROFILE_ITEM_TYPE}
                name={item.name}
                label={item.label}
                defaultValue={member[item.name as keyof typeof member]}
                updateMemberProfile={updateMemberProfile}
                memberCanEdit={canEdit}
                key={item.name}
                icon={item.icon as any}
              />
            ))}
        </ProfileItems>
      </Profile>
    </Page>
  )
}

export default CommunityMember
