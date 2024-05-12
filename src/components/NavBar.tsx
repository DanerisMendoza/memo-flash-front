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
import { LOGIN_DIALOG, REGISTER_DIALOG, CLEAR_USER_DETAILS } from '../store/user.tsx'

import type { RootState } from '../store/store'

const roles = [
  { id: 0, pages: ['Users'] },
  { id: 1, pages: ['Deck', 'Profile'] }
];

const settings = ['logout'];

export default function ResponsiveAppBar() {

  const navigate = useNavigate();

  const dispatch = useDispatch()

  const USER_DETAILS = useSelector(
    (state: RootState) => state.userReducer.USER_DETAILS
  );

  const location = useLocation()




  useEffect(() => {
    // getUSER_DETAILS()(dispatch);
  }, []);

  const SwitchPage = (item: string) => {
    navigate(`/${item}`, { replace: true });
  };
  const Login = () => {
    dispatch(LOGIN_DIALOG(true))
  };
  const Register = () => {
    dispatch(REGISTER_DIALOG(true))
  };

  const HandleSettings = (item: string) => {
    if (item === 'logout') {
      dispatch(CLEAR_USER_DETAILS())
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
          {USER_DETAILS.role.length > 0 ? (
            // logged in
            <>
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                {USER_DETAILS.role.map((roleId) => {
                  const role = roles.find((r) => r.id === roleId);
                  if (role) {
                    return role.pages.map((page, idx) => (
                      <Button
                        key={`${roleId}-${idx}`}
                        onClick={() => SwitchPage(page)}
                        sx={page == location.pathname.substring(1) ? { color: 'white', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '0.5rem' } : { color: 'white', }}
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
                onClick={handleClick}
                style={{ color: 'white' }}
              >
                <p className='p-2'>
                  {USER_DETAILS.name.split(' ')[0]}
                </p>
                {USER_DETAILS.profile_pic_path != '' ? (
                  <Avatar alt="Remy Sharp" src={(USER_DETAILS as any).profile_pic} className='bg-white ' />
                ) : (
                  <Avatar src="/images/avatar.png"  className='bg-white ' />
                )}
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

