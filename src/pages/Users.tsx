import React from 'react';
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetails, getUsers } from '../features/user/details'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react'

const columns: GridColDef[] = [
    { field: 'name', headerName: 'name', flex: 1, align: 'center', headerAlign: 'center', },
    { field: 'username', headerName: 'username', flex: 1, align: 'center', headerAlign: 'center', },
    { field: 'role', headerName: 'role', flex: 1, align: 'center', headerAlign: 'center', },
];

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
