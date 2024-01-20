import { configureStore } from '@reduxjs/toolkit'
import { reducer as userReducer, api as userApi } from './domains/users'

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
})
export type RootState = ReturnType<typeof store.getState>

export default store
