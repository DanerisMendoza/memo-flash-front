import React from 'react';
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from 'react-redux'
import {LOGIN_DIALOG, REGISTER_DIALOG, CLEAR_USER_DETAILS, getUserDetails, getUsers, deleteUser} from '../store/user.tsx'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react'
import { Button, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Users() {
    const dispatch = useDispatch()
    const userDetails = useSelector(
        (state: RootState) => state.userReducer.USER_DETAILS
    );
    
    const users = useSelector(
        (state: RootState) => state.userReducer.USERS
    );

    useEffect(() => {
        getUsers()(dispatch)
    }, []);

  
    useEffect(() => {
        // console.log(users)
    }, [users]);

    const handleButtonClick = (mode: String, item: any) => {
        if (mode === 'delete') {
            deleteUser(item)(dispatch)
        }
    }

    const columns: GridColDef[] = [
        { field: '_id', headerName: 'id', flex: 1, align: 'center', headerAlign: 'center', },
        { field: 'name', headerName: 'name', flex: 1, align: 'center', headerAlign: 'center', },
        { field: 'username', headerName: 'username', flex: 1, align: 'center', headerAlign: 'center', },
        {
            field: 'role',
            headerName: 'role',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <span>
                    {params.row.role.map((roleValue, index) => (
                        <Chip
                            key={index}
                            label={roleValue === 0 ? 'Admin' : 'End-User'}
                            color={roleValue === 0 ? 'primary' : 'secondary'}
                            variant="outlined"
                            size="small"
                            style={{ marginRight: 4 }}
                        />
                    ))}
                </span>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Button variant="contained" style={{ background: 'red' }} onClick={() => handleButtonClick('delete', params.row)}>
                    <DeleteIcon />
                </Button>
            ),
        },
    ];

    return <div className="flex flex-col  h-full w-screen  p-8 mt-4">
        <div style={{ width: '90%', height: '90%', margin: 'auto' }}>
            <div>
                <DataGrid
                    rows={users}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    getRowId={(row) => row._id}
                />
            </div>
        </div>
    </div>;
}
