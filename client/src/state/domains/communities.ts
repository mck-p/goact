import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Community } from '../../services/communities.schema'
import { User } from './users'
const ROOT_URL = 'http://localhost:8080/api/v1'

const COMMUNITIES_BASE_URL = `${ROOT_URL}/communities`

export const communityApi = createApi({
  reducerPath: 'communityApi',
  tagTypes: ['Communities', 'CommunityUsers'],
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
    getCommunityMembers: build.query<User[], string>({
      query: (id: string) => `/${id}/members`,
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'CommunityUsers', id: _id }))
          : ['CommunityUsers'],
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
} = communityApi
