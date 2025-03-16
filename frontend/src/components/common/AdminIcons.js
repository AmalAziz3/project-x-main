import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Notifications as NotificationsIcon, Person as PersonIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

function AdminIcons() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAnnouncementsClick = () => {
    navigate('/notifications');
  };

  const handleProfileClick = () => {
    navigate('/profile/admin');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/Home');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        display: 'flex',
        gap: 2,
        zIndex: 1200,
      }}
    >
      <Tooltip title="Profile">
        <IconButton
          onClick={handleProfileClick}
          sx={{
            color: '#00E5FF',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
            zIndex: 1300,
          }}
        >
          <PersonIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Announcements">
        <IconButton
          onClick={handleAnnouncementsClick}
          sx={{
            color: '#00E5FF',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
            zIndex: 1300,
          }}
        >
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Logout">
        <IconButton
          onClick={handleLogout}
          sx={{
            color: '#00E5FF',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <LogoutIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default AdminIcons; 
