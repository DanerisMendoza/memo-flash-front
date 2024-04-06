import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { useSelector, useDispatch } from 'react-redux'
import { set_register_dialog } from '../features/user/registerDialogSlice'
import type { RootState } from '../store/store'

import TextField from '@mui/material/TextField';


export default function HomePage() {
    const [open, setOpen] = React.useState(false);
    const registerDialog = useSelector((state: RootState) => state.registerDialog.value)
    const dispatch = useDispatch()
    const handleRegister = () => {

    };

    const handleClose = () => {
        dispatch(set_register_dialog(false))
    };

    return <div>
        <React.Fragment>
            <div>Landing Page</div>
            <Dialog
                open={registerDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"User Registration"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className='flex flex-col gap-2'>
                        <TextField id="filled-basic" label="Username" variant="filled" />
                        <TextField id="filled-basic" label="Password" variant="filled" type="password"/>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleRegister} autoFocus>
                        Register
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    </div>;
}
