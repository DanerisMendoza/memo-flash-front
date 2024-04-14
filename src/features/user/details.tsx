import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from '../../api.js';
// ts
export interface UserDialogState {
    username: String,
    name: String,
    role: number[]; //0=> admin, 1=>enduser
}

// state
const initialState: UserDialogState = {
    username: '',
    name: '',
    role: [],
};

// slice
export const userDetailsSlice = createSlice({
    name: "dialog",
    initialState,
    reducers: {
        set_user_details: (state, action: PayloadAction<any>) => {
            state.username = action.payload.username;
            state.name = action.payload.name;
            state.role = action.payload.role;
        },
        clear_user_details: (state) => {
            state.username = '';
            state.name = '';
            state.role = [];
        },
    },
});

// api
export const getUserDetails = () => async (dispatch: any) => {
    try {
        const response = await axiosInstance.get("/api/getUserByToken");
        dispatch(set_user_details(response.data)); // Assuming response.data has { username, name, role }
    } catch (error) {
        // Handle error if needed
        console.error("Error fetching user details:", error);
    }
};


export const { set_user_details,clear_user_details } = userDetailsSlice.actions;

export const userDetailsReducer = userDetailsSlice.reducer;