import React, { useEffect } from 'react';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { SET_DECK_DIALOG, getDeckByUserId, Deck as DeckInterface, deleteDeckById, SET_SELECTED_DECK } from '../store/deck.tsx'
import { SET_CARD_DIALOG, SET_REVIEW_DIALOG } from '../store/card.tsx'
import CardDialog from '../components/CardDialog.tsx';
import ReviewDialog from '../components/ReviewDialog.tsx';

import DeckDialog from '../components/DeckDialog.tsx';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export default function Inventory() {
    const dispatch = useDispatch()
    const USER_DETAILS = useSelector((state: RootState) => state.userReducer.USER_DETAILS);
    const DECKS = useSelector((state: RootState) => state.deckReducer.DECKS);
    const CARD_DIALOG = useSelector((state: RootState) => state.cardReducer.CARD_DIALOG);
    const REVIEW_DIALOG = useSelector((state: RootState) => state.cardReducer.REVIEW_DIALOG);

    useEffect(() => {
        fetchDecks()
    }, [])

    const deleteSelectedDeck = (deck) => {
        console.log(deck._id)
        const payload = { id: deck._id }
        deleteDeckById(payload).then(() => {
            fetchDecks()
        })
    }

    const openDeck = (deck) => {
        dispatch(SET_CARD_DIALOG(true))
        dispatch(SET_SELECTED_DECK(deck))
    }
    
    const reviewDeck = (deck) => {
        dispatch(SET_REVIEW_DIALOG(true))
        dispatch(SET_SELECTED_DECK(deck))
    }

    const fetchDecks = () => {
        const payload = { id: USER_DETAILS.id }
        getDeckByUserId(dispatch, payload).then((response: any) => {
            console.log(response.data)
        })
    }

    return <div className="h-screen w-screen flex flex-col p-8 mt-4">
        <Card className='mt-4'>
            <CardContent >
                <div className='flex items-center mb-4'>
                    <h1>DECKS</h1>
                    <div className='grow'></div>
                    <Button variant="contained" onClick={() => { dispatch(SET_DECK_DIALOG(true)) }}>Add New Deck</Button>
                </div>

                {DECKS.length > 0 && DECKS.map((deck: DeckInterface, index) => (
                    <Card key={index} className="mt-4">
                        <CardContent className='flex gap-2'>
                            <div>
                                <Typography variant="h5" component="div">
                                    {deck.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {deck.description}
                                </Typography>
                            </div>
                            <div className='grow'></div>
                            <Button variant="contained" color='secondary' onClick={() => { reviewDeck(deck)}}>REVIEW</Button>
                            <Button variant="outlined" onClick={() => openDeck(deck)}><EditIcon /></Button>
                            <Button variant="contained" onClick={() => deleteSelectedDeck(deck)} style={{ background: 'red' }}><DeleteIcon /></Button>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
        <DeckDialog />
        {REVIEW_DIALOG && <ReviewDialog />}
        {CARD_DIALOG && <CardDialog />}
    </div>
}
