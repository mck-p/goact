import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Lens } from 'monocle-ts'

import { Community } from '../../services/communities.schema'

const ROOT_URL = 'http://localhost:8080/api/v1'

const COMMUNITIES_BASE_URL = `${ROOT_URL}/communities`

export enum COMFORT_ITEM_TYPE {
  FOOD = 'food',
  GENERAL = 'general',
}

export interface ComfortItem {
  type: COMFORT_ITEM_TYPE
  title: string
  notes?: string
  canBeDelivered?: boolean
  deliveryOptions?: string[]
  fromSpecificPlace?: boolean
  specificPlace?: string[]
}

export interface CommunityMemberProfile {
  avatar?: string
  name?: string
  comfortItems?: ComfortItem[]
}

export interface CommunityMember {
  community: string
  member: string
  user_name: string
  user_avatar: string
  profile: CommunityMemberProfile
}

export const CommunityMemberLens = Lens.fromProp<CommunityMember>()

export const CommunityMemberProfile =
  Lens.fromProp<CommunityMember>()('profile')

export const CommunityMemberCommunityIDLens = CommunityMemberLens('community')
export const CommunityMemberIdLens = CommunityMemberLens('member')
export const CommunityMemberUserNameLens = CommunityMemberLens('user_name')
export const CommunityMemberUserAvatarLens = CommunityMemberLens('user_avatar')

export const CommunityMemberComfortItemsLens = CommunityMemberLens(
  'profile',
).compose(Lens.fromProp<CommunityMemberProfile>()('comfortItems'))

export const CommunityMemberProfileNameLens = CommunityMemberProfile.compose(
  Lens.fromProp<CommunityMemberProfile>()('name'),
)

export const CommunityMemberProfileAvatarLens = CommunityMemberProfile.compose(
  Lens.fromProp<CommunityMemberProfile>()('avatar'),
)

export const CommunityMemberNameLens = new Lens<CommunityMember, string>(
  (cm: CommunityMember) => {
    const profileName = CommunityMemberProfileNameLens.get(cm)

    if (!profileName) {
      return CommunityMemberUserNameLens.get(cm)
    }

    return profileName
  },
  (name: string) => (cm: CommunityMember) =>
    CommunityMemberProfileNameLens.modify(() => name)(cm),
)

export const CommunityMemberAvatarLens = new Lens<CommunityMember, string>(
  (cm: CommunityMember) => {
    const profileName = CommunityMemberProfileAvatarLens.get(cm)

    if (!profileName) {
      return CommunityMemberUserAvatarLens.get(cm)
    }

    return profileName
  },
  (name: string) => (cm: CommunityMember) =>
    CommunityMemberProfileAvatarLens.modify(() => name)(cm),
)

export const CommunityLens = Lens.fromProp<Community>()
export const CommunityIdLens = CommunityLens('_id')
export const CommunityNameLens = CommunityLens('name')

export const communityApi = createApi({
  reducerPath: 'communityApi',
  tagTypes: ['Communities', 'CommunityMembers'],
  baseQuery: fetchBaseQuery({
    baseUrl: COMMUNITIES_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (build) => ({
    getCommunities: build.query<Community[], void>({
      query: () => '',
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'Communities', id: _id }))
          : ['Communities'],
    }),
    getCommunityByID: build.query<Community, string>({
      query: (id: string) => `/${id}`,
    }),
    getCommunityMembers: build.query<CommunityMember[], string>({
      query: (id: string) => `/${id}/members`,
      providesTags: (result) =>
        result
          ? result.map(({ community, member }) => ({
              type: 'CommunityMembers',
              id: `${community}::${member}`,
            }))
          : ['CommunityMembers'],
    }),
    getCommunityMember: build.query<
      CommunityMember,
      { community: string; member: string }
    >({
      query: ({ community, member }) => `/${community}/members/${member}`,
      providesTags: (result) =>
        result
          ? [
              {
                type: 'CommunityMembers',
                id: `${result.community}::${result.member}`,
              },
            ]
          : ['CommunityMembers'],
    }),
    addCommunity: build.mutation<Community, Partial<Community>>({
      query(body) {
        return {
          url: `/`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['Communities'],
    }),
    updateCommunityMemberProfile: build.mutation<
      CommunityMember,
      CommunityMemberProfile & { communityId: string; memberId: string }
    >({
      query({ communityId, memberId, ...profile }) {
        return {
          url: `/${communityId}/members/${memberId}/profile`,
          method: 'PUT',
          body: {
            profile,
          },
        }
      },
      invalidatesTags: (result) =>
        result
          ? [
              {
                type: 'CommunityMembers',
                id: `${result.community}::${result.member}`,
              },
            ]
          : ['CommunityMembers'],
    }),
    detleteCommunity: build.mutation<unknown, string>({
      query(id) {
        return {
          url: `/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Communities'],
    }),
  }),
})

export const {
  useAddCommunityMutation,
  useGetCommunitiesQuery,
  useGetCommunityByIDQuery,
  useGetCommunityMembersQuery,
  useDetleteCommunityMutation,
  useGetCommunityMemberQuery,
  useUpdateCommunityMemberProfileMutation,
} = communityApi
