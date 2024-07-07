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
import { useNavigate, useLocation } from "react-router-dom";
import { SET_DECK_DIALOG, getDeckByUserId } from '../store/deck.tsx'
import { USER_DETAILS } from "../store/user.tsx";

export default function LoginDialog() {
    const dispatch = useDispatch();
    const DECK_DIALOG = useSelector((state: RootState) => state.deckReducer.DECK_DIALOG);
    const USER_DETAILS = useSelector((state: RootState) => state.userReducer.USER_DETAILS);

    interface FormData {
        name: string;
        description: string;
    }
    const [currentField, setCurrentField] = useState(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState<any>({});
    const DialogClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        setErrors({});
        dispatch(SET_DECK_DIALOG(false));
    };

    const submit = async (e) => {
        e.preventDefault();
        const result = validateForm();
        if (Object.keys(result).length == 0) {
            const payload = {
                user_id: USER_DETAILS.id,
                name: formData.name,
                description: formData.description,
            };
            createDeck(dispatch, payload).then((response: any) => {
                console.log(response)
                if (response.status === 200) {
                    const payload = { id: USER_DETAILS.id }
                    getDeckByUserId(dispatch, payload).then((response: any) => {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: response.data.message,
                        });
                        DialogClose(event, 'buttonClick')
                    })
                }
            }).catch((error) => {
                if (error.response.status === 401 || error.response.status === 404) {
                    const message = error.response.data.message;
                    Swal.fire({
                        icon: "error",
                        title: "Invalid Username or Password!",
                        text: message,
                    });
                    return;
                }
            });
        }
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setCurrentField(name)
    };

    useEffect(() => {
        if (currentField != null) {
            handleErrorChange(currentField);
        }
    }, [formData]);

    const handleErrorChange = (focus) => {
        const updatedErrors = { ...errors };
        const { rule, message } = validationRules[focus];
        const isError = rule(formData[focus]);
        if (isError) {
            updatedErrors[focus] = message;
        } else {
            delete updatedErrors[focus];
        }
        setErrors(updatedErrors);
    };

    const validateForm = () => {
        const validationErrors = {};

        Object.entries(validationRules).forEach(([fieldName, ruleObj]) => {
            const { rule, message } = ruleObj;
            if (rule(formData[fieldName])) {
                validationErrors[fieldName] = message;
            }
        });

        setErrors(validationErrors);
        return validationErrors;
    }

    const validationRules = {
        name: {
            rule: (value) => !value.trim(),
            message: "name is required",
        },
        description: {
            rule: (value) => !value.trim(),
            message: "description is required",
        },
    };

    return (
        <React.Fragment >
            <Dialog
                open={DECK_DIALOG}
                onClose={DialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ zIndex: "0" }}
            >
                <DialogTitle id="alert-dialog-title">
                    <div className="text-center">{"Deck"}</div>
                </DialogTitle>
                <DialogContent className="w-58 lg:w-96">
                    <form>
                        <div className="flex flex-col gap-2 p-2">
                            <TextField
                                label="name"
                                variant="outlined"
                                name="name"
                                error={!!errors.name}
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                                helperText={errors.name}
                            />
                            <TextField
                                label="description"
                                variant="outlined"
                                name="description"
                                error={!!errors.description}
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                                helperText={errors.description}
                            />


                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <div className="w-full flex flex-row justify-center gap-2 pb-4">
                        <Button variant="contained" onClick={submit} autoFocus>
                            Submit
                        </Button>
                        <Button variant="contained" onClick={(event) => DialogClose(event, 'buttonClick')}>
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}