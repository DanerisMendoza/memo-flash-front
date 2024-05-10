import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {LOGIN_DIALOG, REGISTER_DIALOG, CLEAR_USER_DETAILS, getUserDetails} from '../store/user.tsx'
import { useNavigate } from "react-router-dom";
import React from 'react';

const PublicRoutes = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const roles = [
        { role: 0, pages: ['Users'] },
        { role: 1, pages: ['Deck', 'Profile'] }
    ];
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getUserDetails(dispatch).then((response: any) => {
            const access: string[] = [];
            response.data.role.forEach(item => {
                const role = roles.find((r) => r.role === item);
                role?.pages.forEach(element => {
                    access.push(element)
                });
            })
            const default_access = roles.find((r) => r.role === response.data.role[0])?.pages[0]
            if (default_access != null) {
                navigate(`${default_access}`);
            }

        }).catch((error: any) => {
            navigate("/");
        })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (!loading) {
        return <Outlet />;
    }

};

export default PublicRoutes;
