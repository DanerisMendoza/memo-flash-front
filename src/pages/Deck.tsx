import React, { useEffect } from 'react';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { SET_DECK_DIALOG, getDeckByUserId, Deck as DeckInterface } from '../store/deck.tsx'
import DeckDialog from '../components/DeckDialog.tsx';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export default function Inventory() {
    const dispatch = useDispatch()
    const USER_DETAILS = useSelector((state: RootState) => state.userReducer.USER_DETAILS);
    const DECKS = useSelector((state: RootState) => state.deckReducer.DECKS);

    useEffect(() => {
        const payload = { id: USER_DETAILS.id }
        getDeckByUserId(dispatch, payload).then((response: any) => {
            // console.log(response.data)
        })
    }, [])

    useEffect(() => {
        console.log(DECKS)
    }, [DECKS])

    return <div className="h-screen w-screen flex flex-col p-8 mt-4">
        <Card className='mt-4'>
            <CardContent >
                <div className='flex items-center mb-4'>
                    <h1>DECKS</h1>
                    <div className='grow'></div>
                    <Button variant="contained" onClick={() => { dispatch(SET_DECK_DIALOG(true)) }}>Add New Deck</Button>
                </div>

                {DECKS.map((deck: DeckInterface, index) => (
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
                            <Button variant="contained" color='secondary' onClick={() => { dispatch(SET_DECK_DIALOG(true)) }}>REVIEW</Button>
                            <Button variant="outlined" onClick={() => { dispatch(SET_DECK_DIALOG(true)) }}><EditIcon /></Button>
                            <Button variant="contained" style={{ background: 'red' }} onClick={() => { dispatch(SET_DECK_DIALOG(true)) }}><DeleteIcon /></Button>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
        <DeckDialog />
    </div>
}
