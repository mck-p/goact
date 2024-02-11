import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const ROOT_URL = 'http://localhost:8080/api/v1'

const USER_BASE_URL = `${ROOT_URL}/users`
interface User {
  id: string
  externalId: string
  name: string
  avatarUrl: string
}

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: USER_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserByIdQuery, useLazyGetUserByIdQuery, usePrefetch } =
  userApi
