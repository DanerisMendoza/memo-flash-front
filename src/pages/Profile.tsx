import React from 'react';
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { Button, Chip } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import CardHeader from '@mui/material/CardHeader';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import TextField from "@mui/material/TextField";
import Input from '@mui/joy/Input';
import { Margin } from '@mui/icons-material';
import axiosInstance from '../api.js';
import Swal from "sweetalert2";
import { getUserDetails } from '../store/user.tsx'

export default function Users() {
    const dispatch = useDispatch()
    const [isLg, setIsLg] = useState(window.innerWidth >= 1024);
    const userDetails = useSelector(
        (state: RootState) => state.userReducer.USER_DETAILS
    );
    const [operation, set_operation] = useState<string>('');
    interface FormData {
        name: string;
        username: string;
        email: string;
        picture: File | null;
    }
    const [formData, setFormData] = useState<FormData>({
        name: "",
        username: "",
        email: "",
        picture: null,
    });
    const [errors, setErrors] = useState<any>({});
    const [currentField, setCurrentField] = useState(null);
    useEffect(() => {
        // console.log(userDetails)
    }, [userDetails]);

    useEffect(() => {
        const handleResize = () => {
            setIsLg(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    useEffect(() => {
        setFormData({
            ...formData,
            name: userDetails.name.toString(),
            username: userDetails.username.toString(),
            email: userDetails.email.toString(),
        });
    }, [userDetails]);

    const edit = () => {
        set_operation('edit')
    }

    const submit = async () => {
        const result = validateForm();
        if (Object.keys(result).length == 0) {
            const payload = new FormData()
            payload.append('name', formData.name);
            payload.append('username', formData.username);
            payload.append('email', formData.email);
            if (formData.picture !== null) {
                payload.append('picture', formData.picture);
            } else {
                payload.append('picture', '');
            }

            await axiosInstance
                .put(`/api/users/${userDetails.id}`, payload)
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem("mff-token", response.data.token);
                        getUserDetails(dispatch)
                        setTimeout(() => {
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: "Update User successful!",
                            });
                        }, 1000);
                        set_operation('')
                    }
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        Swal.fire({
                            icon: "error",
                            title: "Error!",
                            text: error.response.data.message, 
                        });
                    }
                });
        }
    }

    const cancel = () => {
        set_operation('')
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

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
    };



    return <div className="flex flex-col  h-full w-screen  p-8 mt-4">
        <div style={{ width: '90%', height: '90%', margin: 'auto' }}>

            <Card>
                <CardHeader
                    action={
                        <Button className='' onClick={() => edit()}>
                            <EditIcon />
                        </Button>
                    }
                />
                <CardContent>
                    <div className='flex flex-col  drop-shadow-2xl'>
                        <div className='flex flex-col justify-between lg:flex-row items-center'>
                            <div className='p-3 flex flex-col bg-white m-2 h-2/3 lg:h-1/3 lg:w-1/3' style={{ width: '40%' }}>
                                <img alt="avatar" src="/images/avatar.png" />
                                {operation === 'edit' && (
                                    <Button
                                        className='self-center'
                                        component="label"
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                        onChange={(e) => setFormData({ ...formData, picture: (e.target as any).files ? (e.target as any).files[0] : null })}
                                    >
                                        Upload file
                                        <VisuallyHiddenInput type="file" />
                                    </Button>)}
                            </div>
                            {/* <div className='grow'></div> */}
                            <div className='grow flex flex-col  p-2 text-xl lg:text-2xl ' style={{ width: '60%' }}>
                                <div className=' m-auto flex flex-col gap-2'>
                                    {operation === 'edit' ? (
                                        <>
                                            <TextField
                                                placeholder="Name"
                                                variant="outlined"
                                                name="name"
                                                defaultValue={`${userDetails.name}`}
                                                error={!!errors.name}
                                                helperText={errors.name}
                                                onChange={handleFieldChange}
                                                onBlur={handleFieldChange}
                                            />
                                            <TextField
                                                placeholder="Email"
                                                variant="outlined"
                                                name="email"
                                                defaultValue={`${userDetails.email}`}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                onChange={handleFieldChange}
                                                onBlur={handleFieldChange}
                                            />
                                            <TextField
                                                placeholder="Username"
                                                variant="outlined"
                                                name="username"
                                                defaultValue={`${userDetails.username}`}
                                                error={!!errors.username}
                                                helperText={errors.username}
                                                onChange={handleFieldChange}
                                                onBlur={handleFieldChange}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {isLg ? (
                                                <div>
                                                    <p>Name: {userDetails.name}</p>
                                                    <p>Email: {userDetails.email}</p>
                                                    <p>Username: {userDetails.username}</p>
                                                </div>
                                            ) : (
                                                // Render on screens smaller than 'lg'
                                                <div>
                                                    <p>{userDetails.name}</p>
                                                    <p>{userDetails.email}</p>
                                                    <p>{userDetails.username}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                {operation === 'edit' && (
                    <CardActions disableSpacing>
                        <div className='flex flex-row gap-2' style={{ marginLeft: 'auto' }}>
                            <Button className='' style={{ background: 'red' }} variant="contained" onClick={() => cancel()} >
                                <ClearIcon />
                            </Button>
                            <Button className='' style={{ background: 'green' }} variant="contained" onClick={() => submit()} >
                                <CheckIcon />
                            </Button>
                        </div>
                    </CardActions>
                )}
            </Card>
        </div>
    </div >;
}
