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
import {REGISTER_DIALOG} from '../store/user.tsx'
import axiosInstance from '../api.js';
import Swal from "sweetalert2";

export default function LoginDialog() {
    const dispatch = useDispatch();
    const registerDialog = useSelector(
        (state: RootState) => state.userReducer.REGISTER_DIALOG
    );

    interface FormData {
        name: string;
        email: string;
        username: string;
        password: string;
    }
    const [currentField, setCurrentField] = useState(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState<any>({});
    const RegisterClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        setFormData({ name: "", username: "", password: "", email: "" });
        dispatch(REGISTER_DIALOG(false));
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = validateForm();
        if (Object.keys(result).length == 0) {
            const payload = {
                name: formData.name,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                role: [1]
            };
            await axiosInstance
                .post("/api/users", payload)
                .then((response) => {
                    setTimeout(() => {
                        Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: "Registration successful!",
                        });
                    }, 1000);
                    RegisterClose(event, 'buttonClick')
                })
                .catch((error) => {
                    if (error.response.status === 400) {
                        const message = error.response.data.message;
                        Swal.fire({
                            icon: "error",
                            title: "Registration failed",
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
            message: "Name is required",
        },
        email: {
            rule: (value) => !value.trim() || !/\S+@\S+\.\S+/.test(value),
            message: "Please enter a valid email address",
        },
        username: {
            rule: (value) => !value.trim(),
            message: "Username is required",
        },
        password: {
            rule: (value) => !value.trim() || value.length < 6 || value.length > 11,
            message: "between 6 and 11 characters",
        },
    };


    return (
        <React.Fragment>
            <Dialog
                open={registerDialog}
                onClose={RegisterClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ zIndex: "0", }}
            >
                <DialogTitle id="alert-dialog-title">
                    <div className="text-center">{"User Registration"}</div>
                </DialogTitle>
                <DialogContent className="w-58 lg:w-96">
                    <form>
                        <div className="flex flex-col gap-2 p-2">
                            <TextField
                                label="Name"
                                variant="outlined"
                                name="name"
                                error={!!errors.name}
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                                helperText={errors.name}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                name="email"
                                error={!!errors.email}
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                                helperText={errors.email}
                            />
                            <TextField
                                label="Username"
                                variant="outlined"
                                name="username"
                                error={!!errors.username}
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                                helperText={errors.username}
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                name="password"
                                error={!!errors.password}
                                type="password"
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                                helperText={errors.password}
                            />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <div className="w-full flex flex-row justify-center gap-2 pb-4">
                        <Button variant="contained" onClick={(event) => RegisterClose(event, 'buttonClick')}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} autoFocus>
                            Submit
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}