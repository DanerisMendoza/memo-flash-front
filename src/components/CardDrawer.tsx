import * as React from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { SET_CARD_DRAWER, getCardsByDeckId } from '../store/card.tsx';
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Swal from "sweetalert2";
import { createCard } from '../store/card.tsx'
import { USER_DETAILS } from "../store/user.tsx";

export default function DrawerBasic() {
    const dispatch = useDispatch();
    const CARD_DRAWER = useSelector((state: RootState) => state.cardReducer.CARD_DRAWER);
    const USER_DETAILS = useSelector((state: RootState) => state.userReducer.USER_DETAILS);
    const SELECTED_DECK = useSelector((state: RootState) => state.deckReducer.SELECTED_DECK);
    interface FormData {
        front: string;
        back: string;
    }

    const [currentField, setCurrentField] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [formData, setFormData] = useState<FormData>({
        front: "",
        back: "",
    });


    const closeDrawer = (event, reason) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        dispatch(SET_CARD_DRAWER(false));
        setErrors({});
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setCurrentField(name);
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
        front: {
            rule: (value) => !value.trim(),
            message: "front is required",
        },
        back: {
            rule: (value) => !value.trim(),
            message: "back is required",
        },
    };

    const submit = async (e) => {
        e.preventDefault();
        const result = validateForm();
        if (Object.keys(result).length === 0) {
            const payload = {
                deck_id: SELECTED_DECK._id,
                front: formData.front,
                back: formData.back,
            };
            createCard(dispatch, payload).then((response: any) => {
                if (response.status === 201) {
                    const payload = { id: SELECTED_DECK._id }
                    getCardsByDeckId(dispatch, payload).then((response: any) => {
                        closeDrawer(event, 'buttonClick')
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

    return (
        <React.Fragment>
            <Drawer open={CARD_DRAWER} onClose={closeDrawer} anchor='bottom' disableEnforceFocus>
                <form onSubmit={submit}>
                    <div className="flex flex-col gap-2 p-2">
                        <TextField
                            label="front"
                            variant="outlined"
                            name="front"
                            error={!!errors.front}
                            onChange={handleFieldChange}
                            onBlur={handleFieldChange}
                            helperText={errors.front}
                        />
                        <TextField
                            label="back"
                            variant="outlined"
                            name="back"
                            error={!!errors.back}
                            onChange={handleFieldChange}
                            onBlur={handleFieldChange}
                            helperText={errors.back}
                        />
                        <div className='flex gap-1 self-center'>
                            <Button type="submit" autoFocus>
                                Submit
                            </Button>
                            <Button onClick={(event) => closeDrawer(event, 'buttonClick')} autoFocus style={{ background: 'red' }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </Drawer>
        </React.Fragment>
    );
}
