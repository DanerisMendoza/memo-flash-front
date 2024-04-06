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
import { decrement, increment, incrementByAmount } from '../features/counter/counterSlice'
import { set_register_dialog } from '../features/user/registerDialogSlice'
import type { RootState } from '../store/store'

const pages = ['Dashboard', 'Inventory', 'Orders', 'Users'];
const settings = ['logout'];

export default function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
  const registerDialog = useSelector((state: RootState) => state.registerDialog.value)

  const location = useLocation()
  useEffect(() => {
    // console.log("Route changed to:", location.pathname)
  }, [location])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const SwitchPage = (item: string) => {
    navigate(`/${item}`);
  };
  const Login = () => {
    // navigate('/Dashboard');
    dispatch(increment())
  };
  const Register = () => {
    // navigate('');
    dispatch(set_register_dialog(true))
  };

  const HandleSettings = (item: string) => {
    if (item === 'logout') {
      navigate('');
    }
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // console.log(registerDialog)
  const pathname = location.pathname.substring(1);
  const capitalizedPathname = pathname.substring(0, 1).toUpperCase() + pathname.substring(1);

  return (
    <React.Fragment>
      <AppBar >
        <Toolbar >
          <AdbIcon />
          {pages.includes(capitalizedPathname) ? (
            // logged in
            <>
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => SwitchPage(page)}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => HandleSettings(setting)}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
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

