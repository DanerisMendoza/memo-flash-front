import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface RegisterDialogState {
  value: boolean
}

const initialState: RegisterDialogState = {
  value: false,
}

export const registerDialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    set_register_dialog: (state, action: PayloadAction<any>) => {
      state.value = action.payload
    },
  },
})

export const { set_register_dialog } = registerDialogSlice.actions

export default registerDialogSlice.reducer