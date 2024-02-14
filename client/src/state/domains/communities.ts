import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Community } from '../../services/communities.schema'
const ROOT_URL = 'http://localhost:8080/api/v1'

const COMMUNITIES_BASE_URL = `${ROOT_URL}/communities`

export const communityApi = createApi({
  reducerPath: 'communityApi',
  tagTypes: ['Communities'],
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
      query: () => '/',
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'Communities', id: _id }))
          : ['Communities'],
    }),
    addCommunity: build.mutation<Community, Partial<Community>>({
      query(body) {
        return {
          url: `/`,
          method: 'POST',
          body,
        }
      },
      // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      invalidatesTags: ['Communities'],
    }),
  }),
})

export const { useAddCommunityMutation } = communityApi
