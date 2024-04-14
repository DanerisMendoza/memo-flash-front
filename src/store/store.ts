import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import { registerDialogReducer, loginDialogReducer } from '../features/user/components' 
import { userDetailsReducer } from '../features/user/details'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    registerDialog : registerDialogReducer,
    LoginDialog : loginDialogReducer,
    userDetails : userDetailsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch