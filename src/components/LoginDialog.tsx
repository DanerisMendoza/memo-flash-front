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
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginDialog() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const LoginDialogState = useSelector(
        (state: RootState) => state.LoginDialog.value
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
    const roles = [
        { role: 0, pages: ['Users'] },
        { role: 1, pages: ['Deck', 'Profile'] }
    ];
    const [errors, setErrors] = useState<any>({});
    const LoginClose = () => {
        dispatch(set_login_dialog(false));
    };

    const login = async (e) => {
        e.preventDefault();
        if (Object.keys(handleErrorChange(null)).length === 0) {
            const payload = {
                username: formData.username,
                password: formData.password,
            };
            await axiosInstance
                .post("/api/login", payload)
                .then((response) => {
                    localStorage.setItem("mff-token", response.data.token);
                    if (response.status === 200) {
                        getUserDetails(dispatch).then((response: any) => {
                            const access: string[] = [];
                            response.data.role.forEach(item => {
                                const role = roles.find((r) => r.role === item);
                                role?.pages.forEach(element => {
                                    access.push(element)
                                });
                            })
                            const default_access = roles.find((r) => r.role === response.data.role[0])?.pages[0]
                            navigate(`${default_access}`);
                        }).catch((error: any) => { 
                            navigate("/");
                        })
                        LoginClose()
                    }
                })
                .catch((error) => {
                    if (error.response.status === 400) {
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
        handleErrorChange(name);
    };

    const handleErrorChange = (current_field) => {
        const validationErrors: any = {};

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
                open={LoginDialogState}
                onClose={LoginClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ zIndex: "0" }}
            >
                <DialogTitle id="alert-dialog-title">
                    <div className="text-center">{"Login"}</div>
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div className="flex flex-col gap-2 p-2">
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
                        <Button variant="contained" onClick={LoginClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={login} autoFocus>
                            Submit
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}