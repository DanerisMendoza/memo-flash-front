import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import axiosInstance from '../api.js';
import { Deck } from "@mui/icons-material";

// Define the type for the state
export interface Deck {
    _id: String,
    id: String,
    name: String,
    description: String,
    createdAt: String,
}


interface DeckState {
    DECK_DIALOG: boolean;
    DECKS: Deck[],
    SELECTED_DECK: Deck
}

// initial state
const initialState: DeckState = {
    DECK_DIALOG: false,
    DECKS: [],
    SELECTED_DECK: { _id: '', id: '', name: '', description: '', createdAt: '' }
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
        SET_SELECTED_DECK: (state, action: PayloadAction<any>) => {
            state.SELECTED_DECK = action.payload;
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

export const deleteDeckById = (payload) => {
    return new Promise((resolve, reject) => {
        axiosInstance.delete(`/api/deleteDeckById/${payload.id}`).then((response) => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}



// Export actions and reducer
export const { SET_DECK_DIALOG, SET_DECKS, SET_SELECTED_DECK } = deckSlice.actions;
export default deckSlice.reducer;
