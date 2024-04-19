import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { set_user_details, clear_user_details, getUserDetails } from '../features/user/details'
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from '../store/store'
import React from 'react';

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const userDetails = useSelector(
    (state: RootState) => state.userDetails
  );
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
      const pathToGo = location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);

      if (access.includes(pathToGo)) {
        navigate(`${pathToGo}`);
      }
      else if (default_access != null) {
        navigate(`${default_access}`);
      }
      else {
        navigate("/");
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

export default PrivateRoutes;
