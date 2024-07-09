import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CardDrawer from '../components/CardDrawer.tsx';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import type { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { SET_REVIEW_DIALOG, getCardsByDeckId, SET_CARD_DRAWER, Card as CardInterface, } from '../store/card.tsx'


export default function LoginDialog() {
    const dispatch = useDispatch();
    const REVIEW_DIALOG = useSelector((state: RootState) => state.cardReducer.REVIEW_DIALOG);
    const SELECTED_DECK = useSelector((state: RootState) => state.deckReducer.SELECTED_DECK);
    const CARDS = useSelector((state: RootState) => state.cardReducer.CARDS);

    const DialogClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        dispatch(SET_REVIEW_DIALOG(false));
    };

    const add_card = async (e) => {
        dispatch(SET_CARD_DRAWER(true));
    };

    useEffect(() => {
        const payload = { id: SELECTED_DECK._id }
        getCardsByDeckId(dispatch, payload).then((response: any) => {
            console.log(CARDS)
        })
    }, []);


    return (
        <React.Fragment >
            <Dialog
                open={REVIEW_DIALOG}
                onClose={DialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            // style={{ zIndex: "1" }}
            >
                <DialogTitle id="alert-dialog-title">
                    <div className="text-center">{"CARDS"}</div>
                </DialogTitle>
                <DialogContent className="w-58 lg:w-96">
                    {CARDS.length > 0 && CARDS.map((card: CardInterface, index) => (
                        <Card key={index} className="mt-4">
                            <CardContent className='flex gap-2'>
                                <div>
                                    <Typography variant="h5" component="div">
                                        {card.front}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {card.back}
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </DialogContent>
                <DialogActions>
                    <div className="w-full flex flex-row justify-center gap-2 pb-4">
                        <Button variant="contained" color="primary" onClick={add_card} autoFocus>
                            Next Card
                        </Button>
                        <Button variant="contained" style={{ background: 'red' }} onClick={(event) => DialogClose(event, 'buttonClick')}>
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
                <CardDrawer />
            </Dialog>
        </React.Fragment>
    );
}