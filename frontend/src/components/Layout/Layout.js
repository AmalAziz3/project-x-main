import React from 'react';
import {
  Box,
  Container,
} from '@mui/material';

function Layout({ children }) {
  return (
    <Box>
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
}

export default Layout; 
