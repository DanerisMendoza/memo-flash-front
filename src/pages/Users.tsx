import React from 'react';
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { set_register_dialog, set_login_dialog } from '../features/user/components'
import { set_user_details, clear_user_details, getUserDetails, getUsers } from '../features/user/details'
import { useState, useEffect } from 'react'

export default function Users() {
    const dispatch = useDispatch()
    const userDetails = useSelector(
        (state: RootState) => state.userDetails
    );
    const users = useSelector(
        (state: RootState) => state.users
    );
    useEffect(() => {
        getUserDetails()(dispatch)
    }, []); 
    useEffect(() => {
        getUsers()(dispatch)
    }, []); 

    useEffect(() => {
        // console.log(userDetails)
    }, [userDetails]);

    useEffect(() => {
        console.log(users)
    }, [users]);

    return <div className="flex flex-col  h-full w-full  p-8 mt-4">
        <p>Users Page</p>
    </div>;
}
