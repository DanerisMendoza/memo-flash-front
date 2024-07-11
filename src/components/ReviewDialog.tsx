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

import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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

    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    function CircularProgressWithLabel(props) {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" {...props} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="text.secondary">
                        {`${Math.round(props.value)}%`}
                    </Typography>
                </Box>
            </Box>
        );
    }




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
                    <Swiper
                        slidesPerView={1}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                        modules={[Navigation, Pagination]}
                        pagination={{
                            type: 'progressbar',
                            // progressbarOpposite: false,
                            // horizontalClass: 'swiper-pagination-horizontal'
                        }}
                    >
                        {CARDS.length > 0 && CARDS.map((card: CardInterface, index) => (
                            <SwiperSlide>
                                <Card key={index} className="mt-4 p-1 ">
                                    <CircularProgressWithLabel  value={progress} />
                                    <CardContent >
                                            <Typography variant="h5" component="div">
                                                Question: {card.front}
                                            </Typography>
                                            <Typography variant="h5" color="textSecondary">
                                                Answer: {card.back}
                                            </Typography>
                                    </CardContent>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </DialogContent>
                <DialogActions>
                    <div className="w-full flex flex-row justify-center gap-2 pb-4">
                        <Button variant="contained" color="primary" onClick={add_card} autoFocus>
                            Restart
                        </Button>
                        <Button variant="contained" style={{ background: 'green' }} color="primary" onClick={add_card} autoFocus>
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

