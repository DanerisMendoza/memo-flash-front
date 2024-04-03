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

const pages = ['Dashboard', 'Inventory', 'Orders', 'Users'];
const settings = ['logout'];

export default function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const location = useLocation()
  useEffect(() => {
    console.log("Route changed to:", location.pathname)
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
  };
  const Register = () => {
    // navigate('');
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

  return (
    <React.Fragment>
      <AppBar >
        <Toolbar >
          <AdbIcon />

          {location.pathname !== '/' && (
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
          )}

          {location.pathname !== '/' && (
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
          )}


          {location.pathname == '/' && (
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
      </AppBar>
    </React.Fragment>
  );
}

