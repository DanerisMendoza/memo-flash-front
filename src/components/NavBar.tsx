import * as React from 'react';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { set_register_dialog, set_login_dialog } from '../features/user/components'
import { set_user_details, clear_user_details, getUserDetails } from '../features/user/details'

import type { RootState } from '../store/store'

const roles = [
  { id: 0, pages: ['Users'] },
  { id: 1, pages: ['Deck', 'Profile'] }
];

const settings = ['logout'];

export default function ResponsiveAppBar() {

  const navigate = useNavigate();

  const dispatch = useDispatch()

  const userDetails = useSelector(
    (state: RootState) => state.userDetails
  );

  useEffect(() => {
    getUserDetails()(dispatch).then(response => {

    });
  }, []); // Empty dependency array means this effect runs only once after the initial render

  useEffect(() => {
    if (userDetails.role.length > 0) {
      console.log(userDetails)
      const role = roles.find((r) => r.id === userDetails.role[0]);
      if (role) {
        navigate(role.pages[0]);
      }
    }
    else {
      navigate('')
    }
  }, [userDetails]); // Trigger this effect whenever userDetails changes


  const SwitchPage = (item: string) => {
    navigate(`/${item}`);
  };
  const Login = () => {
    dispatch(set_login_dialog(true))
  };
  const Register = () => {
    dispatch(set_register_dialog(true))
  };

  const HandleSettings = (item: string) => {
    if (item === 'logout') {
      dispatch(clear_user_details())
      navigate('');
      localStorage.removeItem("mff-token");
    }
    setAnchorEl(null);
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <AppBar >
        <Toolbar >
          <AdbIcon />
          {userDetails.role.length > 0 ? (
            // logged in
            <>
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                {userDetails.role.map((roleId) => {
                  const role = roles.find((r) => r.id === roleId);
                  if (role) {
                    return role.pages.map((page, idx) => (
                      <Button
                        key={`${roleId}-${idx}`}
                        onClick={() => SwitchPage(page)}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                      >
                        {page}
                      </Button>
                    ));
                  }
                  return null;
                })}
              </Box>

              <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                <Avatar alt="Remy Sharp" src="/images/avatar.png" className='bg-white '/>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => HandleSettings('logout')}>Logout</MenuItem>
              </Menu>

            </>
          ) : (
            // not logged in
            <Box className='w-screen flex flex-row justify-end'>
              <Button
                onClick={() => Login()}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Login
              </Button>
              <Button
                onClick={() => Register()}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar >
    </React.Fragment >
  );
}

