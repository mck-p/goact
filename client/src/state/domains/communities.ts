import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Lens } from 'monocle-ts'

const ROOT_URL = 'http://localhost:8080/api/v1'

const COMMUNITIES_BASE_URL = `${ROOT_URL}/communities`

export interface CommunityMemberProfile {
  avatar?: string
  name?: string
  [x: string]: any
}

export interface CommunityMember {
  community: string
  member: string
  user_name: string
  user_avatar: string
  profile: CommunityMemberProfile
  profile_schema: Record<string, any>
}

export interface CommunityFeedItem {
  _id: string
  type: string
  created_at: string
  updated_at: string
  author_id: string
  data: Record<string, unknown>
}

export enum PROFILE_ITEM_TYPE {
  TEXT = 'text',
  DATE = 'date',
  MULTI_LINE_TEXT = 'multiline',
}

export interface CommunityProfileSchemaItem {
  type: PROFILE_ITEM_TYPE
  icon: string
  label: string
  name: string
}

export interface Community {
  _id: string
  name: string
  is_public: boolean
  profile_schema: Record<string, any>
}

export const CommunityMemberLens = Lens.fromProp<CommunityMember>()

export const CommunityMemberProfile =
  Lens.fromProp<CommunityMember>()('profile')

export const CommunityMemberCommunityIDLens = CommunityMemberLens('community')
export const CommunityMemberIdLens = CommunityMemberLens('member')
export const CommunityMemberUserNameLens = CommunityMemberLens('user_name')
export const CommunityMemberUserAvatarLens = CommunityMemberLens('user_avatar')

export const CommunityMemberProfileNameLens = CommunityMemberProfile.compose(
  Lens.fromProp<CommunityMemberProfile>()('name'),
)

export const CommunityMemberProfileAvatarLens = CommunityMemberProfile.compose(
  Lens.fromProp<CommunityMemberProfile>()('avatar'),
)

export const lensForProfileKey = (key: string) =>
  CommunityMemberLens('profile').compose(Lens.fromProp<any>()(key))

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
  tagTypes: ['Communities', 'CommunityMembers', 'CommunityFeedItems'],
  baseQuery: fetchBaseQuery({
    baseUrl: COMMUNITIES_BASE_URL,
  }),
  endpoints: (build) => ({
    getCommunities: build.query<Community[], { token: string }>({
      query: ({ token }) => ({
        url: '',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'Communities', id: _id }))
          : ['Communities'],
    }),
    getCommunityByID: build.query<Community, { token: string; id: string }>({
      query: ({ id, token }) => ({
        url: `/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getCommunityFeedItems: build.query<
      CommunityFeedItem[],
      { token: string; id: string }
    >({
      query: ({ id, token }) => ({
        url: `/${id}/items`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({
              type: 'CommunityFeedItems',
              id: _id,
            }))
          : ['CommunityFeedItems'],
    }),
    getCommunityMembers: build.query<
      CommunityMember[],
      { token: string; id: string }
    >({
      query: ({ id, token }) => ({
        url: `/${id}/members`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
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
      { community: string; member: string; token: string }
    >({
      query: ({ community, member, token }) => ({
        url: `/${community}/members/${member}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
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
    addCommunity: build.mutation<
      Community,
      { community: Partial<Community>; token: string }
    >({
      query({ community, token }) {
        return {
          url: `/`,
          method: 'POST',
          body: community,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
      invalidatesTags: ['Communities'],
    }),
    postFeedItem: build.mutation<
      CommunityFeedItem,
      { item: Partial<CommunityFeedItem>; token: string; communityId: string }
    >({
      query({ item, token, communityId }) {
        return {
          url: `/${communityId}/items`,
          method: 'POST',
          body: item,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
      invalidatesTags: ['CommunityFeedItems'],
    }),
    updateCommunityMemberProfile: build.mutation<
      CommunityMember,
      CommunityMemberProfile & {
        communityId: string
        memberId: string
        token: string
      }
    >({
      query({ communityId, memberId, token, ...profile }) {
        return {
          url: `/${communityId}/members/${memberId}/profile`,
          method: 'PUT',
          body: {
            profile,
          },
          headers: {
            Authorization: `Bearer ${token}`,
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
    deleteCommunity: build.mutation<unknown, { token: string; id: string }>({
      query({ id, token }) {
        return {
          url: `/${id}`,
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
      invalidatesTags: ['Communities'],
    }),
  }),
})

export const {
  useAddCommunityMutation,
  useGetCommunitiesQuery,
  useLazyGetCommunitiesQuery,

  useGetCommunityByIDQuery,
  useLazyGetCommunityByIDQuery,

  useGetCommunityMembersQuery,
  useLazyGetCommunityMembersQuery,

  useLazyGetCommunityFeedItemsQuery,
  usePostFeedItemMutation,

  useDeleteCommunityMutation,
  useGetCommunityMemberQuery,
  useLazyGetCommunityMemberQuery,

  useUpdateCommunityMemberProfileMutation,
} = communityApi
