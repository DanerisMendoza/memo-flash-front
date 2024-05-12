import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import axiosInstance from '../api.js';

// Define the type for the state
export interface UserDetailsState {
    id: String,
    username: String,
    email: String,
    name: String,
    role: number[], //0=> admin, 1=>enduser
    profile_pic_path: String,
    profile_pic: any
}


interface UserState {
    REGISTER_DIALOG: boolean;
    LOGIN_DIALOG: boolean;
    USER_DETAILS: UserDetailsState,
    USERS: UserDetailsState[],
}

// initial state
const initialState: UserState = {
    REGISTER_DIALOG: false,
    LOGIN_DIALOG: false,
    USER_DETAILS: {
        id: '',
        username: '',
        email: '',
        name: '',
        role: [],
        profile_pic_path: '',
        profile_pic: null,
    },
    USERS: [],
};

// Define the type for the reducer
const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        REGISTER_DIALOG: (state, action: PayloadAction<boolean>) => {
            state.REGISTER_DIALOG = action.payload;
        },
        LOGIN_DIALOG: (state, action: PayloadAction<boolean>) => {
            state.LOGIN_DIALOG = action.payload;
        },
        USER_DETAILS: (state, action: PayloadAction<any>) => {
            state.USER_DETAILS.id = action.payload.id;
            state.USER_DETAILS.username = action.payload.username;
            state.USER_DETAILS.email = action.payload.email;
            state.USER_DETAILS.name = action.payload.name;
            state.USER_DETAILS.role = action.payload.role;
            state.USER_DETAILS.profile_pic_path = action.payload.profile_pic_path;
            state.USER_DETAILS.profile_pic = action.payload.profile_pic;
        },
        CLEAR_USER_DETAILS: (state) => {
            state.USER_DETAILS.id = '';
            state.USER_DETAILS.username = '';
            state.USER_DETAILS.email = '';
            state.USER_DETAILS.name = '';
            state.USER_DETAILS.role = [];
            state.USER_DETAILS.profile_pic_path = '';
            state.USER_DETAILS.profile_pic = null;
        },
        USERS: (state, action: PayloadAction<any>) => {
            state.USERS.splice(0, state.USERS.length);
            state.USERS.push(...action.payload);
        },
        CLEAR_USERS: (state) => {
            [
                {
                    username: '',
                    name: '',
                    email: '',
                    role: [],
                    profile_pic_path: [],
                    profile_pic: null,
                },
            ]
        },
    },
});

// api
export const getUserDetails = (dispatch: any) => {
    return new Promise((resolve, reject) => {
        axiosInstance.get("/api/getUserByToken").then((response) => {
            dispatch(USER_DETAILS(response.data));
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

export const getUsers = () => async (dispatch: any) => {
    try {
        const response = await axiosInstance.get("/api/users");
        dispatch(USERS(response.data)); // Assuming response.data has { username, name, role }
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
};

export const deleteUser = (item) => async (dispatch: any) => {
    try {
        await axiosInstance.delete(`/api/users/${item._id}`).then((response) => {
            dispatch(getUsers());
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
};




// Export actions and reducer
export const { REGISTER_DIALOG, LOGIN_DIALOG, USER_DETAILS, CLEAR_USER_DETAILS, USERS, CLEAR_USERS } = userSlice.actions;
export default userSlice.reducer;
