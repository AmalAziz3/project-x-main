import React from 'react';
import { useSelector } from 'react-redux';

// For development purposes, this component simply renders its children
// without any authentication or role checks
const ProtectedRoute = ({ children }) => {
  // Keep the auth state for components that might need it,
  // but don't use it for protection
  const auth = useSelector((state) => state.auth);
  
  console.log('ProtectedRoute - auth state:', auth);
  console.log('Development mode: All routes accessible without restrictions');
  
  // Always render children without any checks
  return children;
};

export default ProtectedRoute; 
