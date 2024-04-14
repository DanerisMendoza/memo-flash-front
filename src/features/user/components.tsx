import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ts
export interface RegisterDialogState {
  value: boolean;
}

export interface LoginDialogState {
  value: boolean;
}

// state
const initialRegisterState: RegisterDialogState = {
  value: false,
};

const initialLoginState: LoginDialogState = {
  value: false,
};
// slice
export const registerDialogSlice = createSlice({
  name: "registerDialog",
  initialState: initialRegisterState,
  reducers: {
    set_register_dialog: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});
export const loginDialogSlice = createSlice({
  name: "loginDialog",
  initialState: initialLoginState,
  reducers: {
    set_login_dialog: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { set_register_dialog } = registerDialogSlice.actions;
export const { set_login_dialog } = loginDialogSlice.actions;

export const registerDialogReducer = registerDialogSlice.reducer;
export const loginDialogReducer = loginDialogSlice.reducer;
