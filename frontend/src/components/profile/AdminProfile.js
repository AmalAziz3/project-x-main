import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BaseLayout from '../Layout/BaseLayout';
import Header from '../Layout/Header';
import { getUserProfile, updateUserProfile } from '../../services/userService';

// Mock admin data for fallback
const mockAdminData = {
  name: 'John Admin',
  email: 'admin@example.com',
  gender: 'male',
  department: 'IT Administration',
  role: 'System Administrator',
  accessLevel: 'Full Access'
};

function EditProfileDialog({ open, onClose, userData, onSave }) {
  // Initialize formData with userData when the component mounts
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    department: '',
    role: '',
    accessLevel: ''
  });
  
  // Update formData when userData or open state changes
  useEffect(() => {
    if (userData && open) {
      console.log('Setting form data with:', userData);
      // Create a deep copy to avoid reference issues
      setFormData(JSON.parse(JSON.stringify(userData)));
    }
  }, [userData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    console.log('Saving form data:', formData);
    // Make sure we're passing a complete copy of the data
    onSave({...formData});
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }
      }}
    >
      <DialogTitle sx={{ color: '#00E5FF' }}>Edit Admin Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 229, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00E5FF',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 229, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00E5FF',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel 
                  id="gender-label"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Gender
                </InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  label="Gender"
                  sx={{ 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 229, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00E5FF',
                    },
                    '& .MuiSelect-icon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 229, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00E5FF',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Access Level"
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleChange}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 229, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00E5FF',
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          startIcon={<CancelIcon />}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          sx={{ 
            bgcolor: 'rgba(0, 229, 255, 0.8)',
            '&:hover': {
              bgcolor: '#00E5FF',
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AdminProfile() {
  // const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useSelector((state) => state.auth);

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserProfile();
        
        console.log('Raw API response data:', userData);
        
        // Transform API data to match the expected format
        const formattedData = {
          name: userData.first_name || userData.username || 'Admin',
          email: userData.email || 'No email provided',
          gender: userData.gender || '',
          department: userData.department || 'IT Administration',
          role: 'System Administrator',
          accessLevel: userData.access_level || 'Full Access'
        };
        
        console.log('Formatted data for UI:', formattedData);
        
        setAdminData(formattedData);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile data. Please try again later.');
        // Fallback to mock data if API fails
        setAdminData(mockAdminData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    setOpenEditProfile(true);
  };
  
  const handleCloseEditProfile = () => {
    setOpenEditProfile(false);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      setLoading(true);
      
      // Get the current profile data first
      const currentProfile = await getUserProfile();
      console.log('Current profile before update:', currentProfile);
      
      // Create a new object with all the current profile data
      const dataToSend = {
        // Include all existing fields from the current profile
        ...currentProfile
      };
      
      // Map the frontend field names to the backend field names
      console.log('Updating admin info with:', updatedData);
      dataToSend.first_name = updatedData.name;
      dataToSend.email = updatedData.email;
      dataToSend.gender = updatedData.gender;
      dataToSend.department = updatedData.department;
      dataToSend.access_level = updatedData.accessLevel;
      
      console.log('Complete data to send to API:', dataToSend);
      
      // Call the API to update the profile with the complete data
      const response = await updateUserProfile(dataToSend);
      console.log('API response after update:', response);
      
      // Wait a moment to ensure the backend has processed the update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh the profile data from the server to ensure we have the latest data
      console.log('Fetching refreshed data...');
      const refreshedData = await getUserProfile();
      console.log('Refreshed data from API:', refreshedData);
      
      // Transform API data to match the expected format
      const formattedData = {
        name: refreshedData.first_name || refreshedData.username || 'Admin',
        email: refreshedData.email || 'No email provided',
        gender: refreshedData.gender || '',
        department: refreshedData.department || 'IT Administration',
        role: 'System Administrator',
        accessLevel: refreshedData.access_level || 'Full Access'
      };
      
      console.log('Formatted data after refresh:', formattedData);
      
      // Update local state with the refreshed data
      setAdminData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
      handleCloseEditProfile();
    }
  };

  // Show loading state while fetching data
  if (loading && !adminData) {
    return (
      <BaseLayout role={role || "admin"}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
          backgroundSize: 'cover',
        }}>
          <CircularProgress sx={{ color: '#00E5FF' }} />
        </Box>
      </BaseLayout>
    );
  }

  const content = (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      pb: 7,
    }}>
      <Header
        name={adminData?.name || 'Admin'}
        title={adminData?.role || 'System Administrator'}
        onEditClick={handleEditProfile}
      />
      
      {error && (
        <Alert severity="error" sx={{ 
          mx: 3, 
          mt: 2, 
          bgcolor: 'rgba(211, 47, 47, 0.1)', 
          color: '#ff5252',
          border: '1px solid rgba(211, 47, 47, 0.3)'
        }}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={30} sx={{ color: '#00E5FF' }} />
        </Box>
      )}
      
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
              },
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontSize: '1.25rem' }}>Admin Profile</Typography>
                  <Button
                    onClick={handleEditProfile}
                    startIcon={<EditIcon />}
                    size="small"
                    sx={{
                      color: '#00E5FF',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                      }
                    }}
                  >
                    Edit
                  </Button>
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon sx={{ color: '#00E5FF' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={adminData?.email} 
                      primaryTypographyProps={{ sx: { color: 'white' } }}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon sx={{ color: '#00E5FF' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Gender" 
                      secondary={adminData?.gender ? (adminData.gender.charAt(0).toUpperCase() + adminData.gender.slice(1)) : 'Not specified'} 
                      primaryTypographyProps={{ sx: { color: 'white' } }}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AdminIcon sx={{ color: '#00E5FF' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Department" 
                      secondary={adminData?.department} 
                      primaryTypographyProps={{ sx: { color: 'white' } }}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon sx={{ color: '#00E5FF' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Access Level" 
                      secondary={adminData?.accessLevel} 
                      primaryTypographyProps={{ sx: { color: 'white' } }}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <EditProfileDialog
        open={openEditProfile}
        onClose={handleCloseEditProfile}
        userData={adminData}
        onSave={handleSaveProfile}
      />
    </Box>
  );

  return (
    <BaseLayout role={role || "admin"}>
      {content}
    </BaseLayout>
  );
}

export default AdminProfile; 
