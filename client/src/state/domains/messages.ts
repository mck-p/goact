import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Message, MessageGroup } from '../../services/messages.schema'
const ROOT_URL = 'http://localhost:8080/api/v1'

const MESSAGE_ROOT_URL = `${ROOT_URL}/messages`

// Define a service using a base URL and expected endpoints
export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: MESSAGE_ROOT_URL,
    prepareHeaders: (headers, { getState }) => {
      console.log('I AM RUNNIN')
      const token = (getState() as any).auth.token
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      } else {
        console.log('NO TOKEN')
      }

      return headers
    },
  }),
  tagTypes: ['Message', 'MessageGroup'],
  endpoints: (builder) => ({
    getMessagesForGroup: builder.query<Message[], string>({
      query: (id) => `/groups/${id}`,
      providesTags: ['Message'],
    }),
    getGroups: builder.query<MessageGroup[], undefined>({
      query: () => `/groups`,
      providesTags: ['MessageGroup'],
    }),
    createGroup: builder.mutation<MessageGroup, string>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (name) => ({
        url: `/groups`,
        method: 'POST',
        body: {
          name,
        },
      }),
      invalidatesTags: ['MessageGroup'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetMessagesForGroupQuery,
  useGetGroupsQuery,
  usePrefetch,
  useCreateGroupMutation,
} = messageApi

export const manuallySetMessageInState = (message: Message) =>
  messageApi.util.updateQueryData(
    'getMessagesForGroup',
    message.group_id,
    (oldList) =>
      Object.values(
        [...oldList, message].reduce(
          (a, c) => {
            if (c._id in a) {
              return a
            }

            a[c._id] = c
            return a
          },
          {} as { [x: string]: Message },
        ),
      ),
  )
