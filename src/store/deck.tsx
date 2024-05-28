import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import axiosInstance from '../api.js';

// Define the type for the state
export interface Deck {
    name: String,
    description: String,
    createdAt: { type: Date },
}


interface DeckState {
    DECK_DIALOG: boolean;
    DECKS: Deck[],
}

// initial state
const initialState: DeckState = {
    DECK_DIALOG: false,
    DECKS: [],
};

// Define the type for the reducer
const deckSlice = createSlice({
    name: "deck",
    initialState: initialState,
    reducers: {
        SET_DECK_DIALOG: (state, action: PayloadAction<boolean>) => {
            state.DECK_DIALOG = action.payload;
        },
        
        SET_DECKS: (state, action: PayloadAction<any>) => {
            state.DECKS = action.payload;
        },
    },
});

// api
export const createDeck = (dispatch: any, payload) => {
    return new Promise((resolve, reject) => {
        axiosInstance.post("/api/createDeck", payload).then((response) => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

export const getDeckByUserId = (dispatch: any, payload) => {
    return new Promise((resolve, reject) => {
        axiosInstance.get(`/api/getDeckByUserId/${payload.id}`).then((response) => {
            dispatch(SET_DECKS(response.data));
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}



// Export actions and reducer
export const { SET_DECK_DIALOG, SET_DECKS } = deckSlice.actions;
export default deckSlice.reducer;
