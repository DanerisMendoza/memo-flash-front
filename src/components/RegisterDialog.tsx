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
import { set_register_dialog, set_login_dialog } from "../features/user/components.js";
import { set_user_details, getUserDetails } from '../features/user/details'
import axiosInstance from '../api.js';
import Swal from "sweetalert2";

export default function LoginDialog() {
    const dispatch = useDispatch();
    const registerDialog = useSelector(
        (state: RootState) => state.registerDialog.value
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
    const RegisterClose = () => {
        setFormData({ name: "", username: "", password: "", email: "" });
        dispatch(set_register_dialog(false));
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
                    RegisterClose();
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


    const validateForm = () => {
        const validationErrors: any = {}
        if (!formData.name.trim()) {
            validationErrors.name = "name is required"

        }
        if (!formData.email.trim()) {
            validationErrors.email = "email is required"

        }
        if (!formData.username.trim()) {
            validationErrors.username = "username is required"

        }

        if (!formData.password.trim()) {
            validationErrors.password = "password is required"

        }
        if (formData.password.length < 6) {
            validationErrors.password = "password should be at least 6 char"
        }

        setErrors(validationErrors)
        return validationErrors
    }

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
            message: "Password should be between 6 and 11 characters",
        },
    };


    return (
        <React.Fragment>
            <Dialog
                open={registerDialog}
                onClose={RegisterClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ zIndex: "0" }}
            >
                <DialogTitle id="alert-dialog-title">
                    <div className="text-center">{"User Registration"}</div>
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div className="flex flex-col gap-2 p-2">
                            <TextField
                                label="Name"
                                variant="outlined"
                                name="name"
                                error={!!errors.name}
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                            />
                            <span>{errors.name}</span>
                            <TextField
                                label="Email"
                                variant="outlined"
                                name="email"
                                error={!!errors.email}
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                            />
                            <span>{errors.email}</span>
                            <TextField
                                label="Username"
                                variant="outlined"
                                name="username"
                                error={!!errors.username}
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                            />
                            <span>{errors.username}</span>
                            <TextField
                                label="Password"
                                variant="outlined"
                                name="password"
                                error={!!errors.password}
                                type="password"
                                onChange={handleFieldChange}
                                onBlur={handleFieldChange}
                            />
                            <span>{errors.password}</span>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <div className="w-full flex flex-row justify-center gap-2 pb-4">
                        <Button variant="contained" onClick={RegisterClose}>
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