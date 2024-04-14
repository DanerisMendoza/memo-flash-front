import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";

export default function Users() {
    const userDetails = useSelector(
        (state: RootState) => state.userDetails
    );
    return <div className="flex flex-col  h-full w-full  p-8 mt-8">
        <p>Users Page</p>
    </div>;
}
