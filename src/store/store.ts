import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import { registerDialogReducer, loginDialogReducer } from '../features/user/dialog' // Import as named import

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    registerDialog : registerDialogReducer,
    LoginDialog : loginDialogReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch