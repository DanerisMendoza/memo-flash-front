import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import axiosInstance from '../api.js';

// Define the type for the state
export interface Card {
    deck_id: String,
    front: String,
    back: String,
}


interface DeckState {
    CARD_DIALOG: boolean;
    CARD_DRAWER: boolean;
    CARD: Card,
    CARDS: Card[],
}

// initial state
const initialState: DeckState = {
    CARD_DIALOG: false,
    CARD_DRAWER: false,
    CARD: {
        deck_id: '',
        front: '',
        back: '',
    },
    CARDS: [],
};

// Define the type for the reducer
const deckSlice = createSlice({
    name: "deck",
    initialState: initialState,
    reducers: {
        SET_CARD_DIALOG: (state, action: PayloadAction<boolean>) => {
            state.CARD_DIALOG = action.payload;
        },
        SET_CARD_DRAWER: (state, action: PayloadAction<boolean>) => {
            state.CARD_DRAWER = action.payload;
        },
        SET_CARD: (state, action: PayloadAction<any>) => {
            state.CARD = action.payload;
        },
        SET_CARDS: (state, action: PayloadAction<any>) => {
            state.CARDS = action.payload;
        },
    },
});

// api
export const createCard = (dispatch: any, payload) => {
    return new Promise((resolve, reject) => {
        axiosInstance.post("/api/createCard", payload).then((response) => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

export const getCardsByDeckId = (dispatch: any, payload) => {
    return new Promise((resolve, reject) => {
        axiosInstance.get(`/api/getCardsByDeckId/${payload.id}`).then((response) => {
            dispatch(SET_CARDS(response.data));
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

export const deleteCardById = (payload) => {
    return new Promise((resolve, reject) => {
        axiosInstance.delete(`/api/deleteCardById/${payload.id}`).then((response) => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}



// Export actions and reducer
export const { SET_CARD_DIALOG, SET_CARD_DRAWER, SET_CARD, SET_CARDS } = deckSlice.actions;
export default deckSlice.reducer;
