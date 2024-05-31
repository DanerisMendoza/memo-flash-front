import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import type { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { createDeck } from '../store/deck.tsx'
import axiosInstance from '../api.js';
import Swal from "sweetalert2";
import { SET_CARD_DIALOG, getCardsByDeckId, SET_CARD_DRAWER } from '../store/card.tsx'
import { USER_DETAILS } from "../store/user.tsx";
import CardDrawer from '../components/CardDrawer.tsx';


export default function LoginDialog() {
    const dispatch = useDispatch();
    const CARD_DIALOG = useSelector(
        (state: RootState) => state.cardReducer.CARD_DIALOG
    );

    const DialogClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        dispatch(SET_CARD_DIALOG(false));
    };

    const add_card = async (e) => {
        dispatch(SET_CARD_DRAWER(true));
    };

    return (
        <React.Fragment >
            <Dialog
                open={CARD_DIALOG}
                onClose={DialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ zIndex: "0" }}
            >
                <DialogTitle id="alert-dialog-title">
                    <div className="text-center">{"CARDS"}</div>
                </DialogTitle>
                <DialogContent className="w-58 lg:w-96">

                </DialogContent>
                <DialogActions>
                    <div className="w-full flex flex-row justify-center gap-2 pb-4">
                        <Button variant="contained" color="secondary" autoFocus>
                            Start Review
                        </Button>
                        <Button variant="contained" color="primary" onClick={add_card} autoFocus>
                            Add Card
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