import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';

function Header({ name, title, onEditClick }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Box 
        sx={{ 
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'rgba(0, 229, 255, 0.2)',
            color: '#00E5FF',
            fontSize: '1.8rem',
            border: '3px solid rgba(0, 229, 255, 0.3)',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)',
          }}
        >
          {getInitials(name)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ 
              color: '#00E5FF',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
            }}>
              {name}
            </Typography>
            <IconButton
              onClick={onEditClick}
              sx={{ 
                color: '#00E5FF',
                '&:hover': {
                  bgcolor: 'rgba(0, 229, 255, 0.1)',
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 500,
          }}>
            {title}
          </Typography>
        </Box>
      </Box>
      {/* Spacer to prevent content from going under the fixed header */}
      <Box sx={{ height: '130px' }} />
    </>
  );
}

export default Header; 
