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
    const USER_DETAILS = useSelector(
        (state: RootState) => state.userReducer.USER_DETAILS
    );
    const [operation, set_operation] = useState<string>('');
    interface FormData {
        name: string;
        username: string;
        email: string;
        avatar_name: string;
        avatar: File | null;
    }
    const [formData, setFormData] = useState<FormData>({
        name: "",
        username: "",
        email: "",
        avatar_name: "",
        avatar: null,
    });
    const [errors, setErrors] = useState<any>({});
    const [currentField, setCurrentField] = useState(null);
    useEffect(() => {
        // console.log(USER_DETAILS)
    }, [USER_DETAILS]);

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
            name: USER_DETAILS.name.toString(),
            username: USER_DETAILS.username.toString(),
            email: USER_DETAILS.email.toString(),
            avatar_name: USER_DETAILS.profile_pic_path.toString(),
        });
        console.log(USER_DETAILS)
    }, [USER_DETAILS]);

    const edit = () => {
        set_operation('edit')
    }

    const submit = async () => {
        const result = validateForm();
        if (Object.keys(result).length == 0) {
            const payload = formData
            await axiosInstance
                .put(`/api/users/${USER_DETAILS.id}`, payload)
                .then(async (response) => {
                    if (formData.avatar != null) {
                        const payload = new FormData()
                        const updatedFile = new File([formData.avatar], response.data.profile_pic_path, { type: formData.avatar.type });
                        payload.append('avatar', updatedFile);
                        await axiosInstance.post(`/api/uploadAvatar`, payload)
                    }

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
                    if (error.response.status == 409) {
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
        getUserDetails(dispatch)
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

            <Card className='h-full '>
                <CardContent className='h-full flex flex-col '>
                    {!isLg && (
                        <div className='flex flex-row items-center justify-end'>
                            <p>INFORMATION</p>
                            <Button className={`${operation === '' ? '' : 'invisible'}`} onClick={() => edit()}>
                                <EditIcon />
                            </Button>
                        </div>
                    )}
                    
                    <div className='h-full flex flex-col gap-2 lg:flex-row '>
                        <div className='flex flex-col gap-2 lg:w-2/5 justify-center'>
                            <img className='w-1/3 self-center lg:w-4/5 ' alt="avatar" src={(USER_DETAILS as any).profile_pic} />
                            <Button
                                className={` w-full lg:w-4/5 lg:self-center ${operation === 'edit' ? '' : 'invisible'}`}
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        avatar: (e.target as any).files ? (e.target as any).files[0] : null,
                                        avatar_name: (e.target as any).files ? (e.target as any).files[0]?.name : ""
                                    })
                                }}
                            >
                                Upload Picture
                                <VisuallyHiddenInput type="file" />
                            </Button>

                        </div>

                        <div className='flex flex-col gap-2 h-full lg:w-3/5'>
                            {isLg && (
                                <div className='flex flex-row items-center justify-end'>
                                    <div style={{ width: '45%' }}></div>
                                    <div style={{ width: '15%' }}>INFORMATION</div>
                                    <div style={{ width: '35%' }}></div>
                                    <div style={{ width: '5%' }}>
                                        <Button className={`${operation === '' ? '' : 'invisible'} `} onClick={() => edit()}>
                                            <EditIcon />
                                        </Button>
                                    </div>
                                </div>
                            )}


                            <div className='flex flex-col gap-2 lg:w-full lg:self-center '>
                                <TextField
                                    className='w-full'
                                    placeholder="Name"
                                    variant="outlined"
                                    name="name"
                                    value={formData.name}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    onChange={handleFieldChange}
                                    onBlur={handleFieldChange}
                                    InputProps={{
                                        readOnly: operation === '',
                                    }}
                                />
                                <TextField
                                    className='w-full'
                                    placeholder="Email"
                                    variant="outlined"
                                    name="email"
                                    value={formData.email}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    onChange={handleFieldChange}
                                    onBlur={handleFieldChange}
                                    InputProps={{
                                        readOnly: operation === '',
                                    }}
                                />
                                <TextField
                                    className='w-full'
                                    placeholder="Username"
                                    variant="outlined"
                                    name="username"
                                    value={formData.username}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    onChange={handleFieldChange}
                                    onBlur={handleFieldChange}
                                    InputProps={{
                                        readOnly: operation === '',
                                    }}
                                />
                            </div>

                            <div className='grow'></div>
                            {operation === 'edit' && (
                                <div className='flex flex-row gap-1' style={{ marginLeft: 'auto' }}>
                                    <Button className='' style={{ background: 'red' }} variant="contained" onClick={() => cancel()} >
                                        <ClearIcon />
                                    </Button>
                                    <Button className='' style={{ background: 'green' }} variant="contained" onClick={() => submit()} >
                                        <CheckIcon />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div >;
}
