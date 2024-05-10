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
import {LOGIN_DIALOG, getUserDetails} from '../store/user.tsx'
import axiosInstance from '../api.js';
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginDialog() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const LoginDialogState = useSelector(
        (state: RootState) => state.userReducer.LOGIN_DIALOG
    );
    interface FormData {
        name: string;
        username: string;
        password: string;
    }
    const [currentField, setCurrentField] = useState(null);
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
    const LoginClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        setErrors({});
        dispatch(LOGIN_DIALOG(false));
    };

    const login = async (e) => {
        e.preventDefault();
        const result = validateForm();
        if (Object.keys(result).length == 0) {
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
                        LoginClose(event, 'buttonClick')
                    }
                })
                .catch((error) => {
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
        <React.Fragment >
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
                <DialogContent className="w-58 lg:w-96">
                    <form>
                        <div className="flex flex-col gap-2 p-2">
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
                        <Button variant="contained" onClick={(event) => LoginClose(event, 'buttonClick')}>
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