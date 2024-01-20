import { createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { definitions } from '../../services/api.schema'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      // const token = (getState() as RootState).auth.token
      // if (token) {
      //   headers.set('authentication', `Bearer ${token}`)
      // }
      return headers
    },
  }),
  endpoints: (build) => ({
    createUser: build.mutation({
      transformResponse: (
        response: {
          data:
            | definitions['server.CreateUserResponse']
            | definitions['server.ErrorResponse-server_GenericError']
        },
        meta,
        arg,
      ) => response.data,
      query: (data: definitions['server.CreateUserRequest']) => ({
        url: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.7jEdG0VecpQQFdfFt5FwqkRlfNrnpGw5NjRUWgMDy8U',
        },
        body: data,
      }),
    }),
  }),
})

export interface Message {
  title: string
  from: string
  to: string
}

export interface MessageState {
  [x: string]: Message
}

const messagesSlice = createSlice({
  name: '@@MESSAGES',
  initialState: {} as MessageState,
  reducers: {},
})

export const actions = messagesSlice.actions

export const reducer = messagesSlice.reducer
