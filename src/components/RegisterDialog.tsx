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
        username: string;
        password: string;
    }
    const [formData, setFormData] = useState<FormData>({
        name: "",
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState<any>({});
    const RegisterClose = () => {
        setFormData({ name: "", username: "", password: "" });
        dispatch(set_register_dialog(false));
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(handleErrorChange(null)).length === 0) {
            const payload = {
                name: formData.name,
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
        handleErrorChange(name);
    };

    const handleErrorChange = (current_field) => {
        const validationErrors: any = {};

        if (!current_field || current_field === 'name') {
            if (!formData.name.trim()) {
                validationErrors.name = "name is required";
            }
        }

        if (!current_field || current_field === 'username') {
            if (!formData.username.trim()) {
                validationErrors.username = "username is required";
            }
        }

        if (!current_field || current_field === 'password') {
            if (!formData.password.trim()) {
                validationErrors.password = "password is required";
            } else if (formData.password.length < 7) {
                validationErrors.password = "password should be at least 8 characters";
            }
        }

        setErrors(validationErrors);
        return validationErrors;
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
                            />
                            <TextField
                                label="Username"
                                variant="outlined"
                                name="username"
                                error={!!errors.username}
                                onChange={handleFieldChange}
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                name="password"
                                error={!!errors.password}
                                type="password"
                                onChange={handleFieldChange}
                            />
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