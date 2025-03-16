import React, { useEffect } from 'react';
import {
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import { baseLayoutStyles } from './baseStyles';
import StudentIcons from '../common/StudentIcons';
import AdminIcons from '../common/AdminIcons';
import ExpertIcons from '../common/ExpertIcons';

function BaseLayout({ children, role: propRole }) {
  // Get role from Redux store if not provided as prop
  const { role: storeRole } = useSelector((state) => state.auth);
  
  // Use the role from props if available, otherwise use from store
  const role = propRole || storeRole;

  useEffect(() => {
    console.log('BaseLayout mounted');
    console.log('Current role:', role);
  }, [role]);

  const renderIcons = () => {
    if (role === 'admin') return <AdminIcons />;
    if (role === 'expert') return <ExpertIcons />;
    if (role === 'student') return <StudentIcons />;
    
    return null;
  };

  return (
    <Box sx={{
      ...baseLayoutStyles.root,
      paddingBottom: '70px', // Changed from 80px to 70px to match the footer height
    }}>
      {renderIcons()}
      {children}
      <Footer role={role} />
    </Box>
  );
}

export default BaseLayout; 
