import React from 'react';
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetails, getUsers, deleteUser } from '../features/user/details'
import { useState, useEffect } from 'react'
import { Button, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';

export default function Users() {
    const dispatch = useDispatch()

    const userDetails = useSelector(
        (state: RootState) => state.userDetails
    );
    // useEffect(() => {
    //     // getUserDetails(dispatch)
    // }, []);

    useEffect(() => {
        console.log(userDetails)
    }, [userDetails]);

    return <div className="flex flex-col  h-full w-screen  p-8 mt-4">
        <div style={{ width: '90%', height: '90%', margin: 'auto' }}>
            <Card>
                <CardHeader
                    action={
                        <Button className=''>
                            <EditIcon />
                        </Button>
                    }
                />
                <CardContent>
                    <div className='flex flex-col  drop-shadow-2xl'>
                        <div className='flex flex-col lg:flex-row items-center'>
                            <img alt="avatar" src="/images/avatar.png" className='bg-white m-2 h-2/3 w-2/3  lg:h-1/3 lg:w-1/3' />
                            <div className='grow'></div>
                            <div className='grow flex flex-col p-2 text-xl lg:text-3xl'>
                                <p>Name: {userDetails.name}</p>
                                <p>Username: {userDetails.username}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>;
}
