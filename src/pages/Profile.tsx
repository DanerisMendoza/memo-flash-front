import React from 'react';
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetails, getUsers, deleteUser } from '../features/user/details'
import { useState, useEffect } from 'react'
import { Button, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Users() {
    const dispatch = useDispatch()

    const userDetails = useSelector(
        (state: RootState) => state.userDetails
    );
    // console.log(userDetails)
    // useEffect(() => {
    //     getUserDetails()(dispatch)
    // }, []);

    // useEffect(() => {
    //     console.log(userDetails)
    // }, [userDetails]);

    return <div className="flex flex-col  h-full w-screen  p-8 mt-4">
        <div style={{ width: '90%', height: '90%', margin: 'auto' }}>
            <div className='flex flex-col'>
                <img alt="avatar" src="/images/avatar.png" className='bg-white' style={{height:'30%',width:'30%'}} />
            </div>
        </div>
    </div>;
}
