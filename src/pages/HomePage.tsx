import React, { useState, useEffect } from 'react';
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
import Swal from 'sweetalert2';

export default function HomePage() {
    const dispatch = useDispatch()

    interface FormData {
        username: string;
        password: string;
    }
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
    })
    const [errors, setErrors] = useState<any>({})

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        })
        handleErrorChange()
    }


    const registerDialog = useSelector((state: RootState) => state.registerDialog.value)

    const handleErrorChange = () => {
        const validationErrors: any = {}
        if (!formData.username.trim()) {
            validationErrors.username = "username is required"
        }

        if (!formData.password.trim()) {
            validationErrors.password = "password is required"
        } else if (formData.password.length < 6) {
            validationErrors.password = "password should be at least 6 char"
        }

        setErrors(validationErrors)
        return validationErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (Object.keys(handleErrorChange()).length === 0) {
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Registration successful!',
                });
            }, 1000);
            handleClose();
        }
    }

    const handleClose = () => {
        setFormData({ username: '', password: '' });
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
                    <div className='text-center'>
                        {"User Registration"}
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-2 p-2'>
                            <TextField label="Username" variant="outlined" name="username" error={!!errors.username} onChange={handleChange} />
                            <TextField label="Password" variant="outlined" name="password" error={!!errors.password} type="password" onChange={handleChange} />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <div className='w-full flex flex-row justify-center gap-2 pb-4'>
                        <Button variant='contained' onClick={handleClose}>Cancel</Button>
                        <Button variant='contained' onClick={handleSubmit} autoFocus>Submit</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    </div>;
}
