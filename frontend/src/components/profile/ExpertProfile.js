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
  Chip,
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
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import BaseLayout from '../Layout/BaseLayout';
import Header from '../Layout/Header';
import { getUserProfile, updateUserProfile } from '../../services/userService';

// Mock expert data for fallback
const mockExpertData = {
  name: 'Dr. Sarah Expert',
  email: 'expert@example.com',
  gender: 'female',
  specialization: 'Computer Science',
  title: 'Senior Career Advisor',
  expertise: ['Career Counseling', 'Academic Planning', 'Industry Relations'],
  qualifications: ['Ph.D. in Computer Science', 'Certified Career Counselor']
};

function EditProfileDialog({ open, onClose, userData, onSave, editType }) {
  // Initialize formData with userData when the component mounts
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    specialization: '',
    title: 'Career Advisor',
    expertise: [],
    qualifications: []
  });
  
  // Update formData when userData or open state changes
  useEffect(() => {
    if (userData && open) {
      console.log('Setting form data with:', userData);
      // Create a deep copy to avoid reference issues
      setFormData(JSON.parse(JSON.stringify(userData)));
    }
  }, [userData, open, editType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    
    if (editType === 'expertise') {
      if (name === 'expertise') {
        setFormData({
          ...formData,
          expertise: value.split(',').map(item => item.trim())
        });
      } else if (name === 'qualifications') {
        setFormData({
          ...formData,
          qualifications: value.split(',').map(item => item.trim())
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    console.log('Saving form data:', formData);
    // Make sure we're passing a complete copy of the data
    onSave({...formData});
  };

  const renderFields = () => {
    if (editType === 'expertise') {
      return (
        <>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specialization"
              name="specialization"
              value={formData.specialization || ''}
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
              label="Areas of Expertise (comma-separated)"
              name="expertise"
              value={Array.isArray(formData.expertise) ? formData.expertise.join(', ') : ''}
              onChange={handleChange}
              multiline
              rows={3}
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
              label="Qualifications (comma-separated)"
              name="qualifications"
              value={Array.isArray(formData.qualifications) ? formData.qualifications.join(', ') : ''}
              onChange={handleChange}
              multiline
              rows={3}
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
        </>
      );
    }

    return (
      <>
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
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
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
            label="Specialization"
            name="specialization"
            value={formData.specialization}
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
      </>
    );
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
      <DialogTitle sx={{ color: '#00E5FF' }}>
        {editType === 'expertise' ? 'Edit Expert Details' : 'Edit Expert Profile'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {renderFields()}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          startIcon={<CancelIcon />}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          startIcon={<SaveIcon />}
          sx={{ 
            color: '#00E5FF',
            '&:hover': {
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
            }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ExpertProfile() {
  const [expertData, setExpertData] = useState(null);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [editType, setEditType] = useState('profile');
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
          name: userData.first_name || userData.username || 'Expert',
          email: userData.email || 'No email provided',
          gender: userData.gender || '',
          specialization: userData.specialization || 'Not specified',
          title: userData.title || 'Career Advisor',
          expertise: userData.expertise ? 
            (typeof userData.expertise === 'string' ? 
              userData.expertise.split(',').map(item => item.trim()) : 
              Array.isArray(userData.expertise) ? userData.expertise : []) : 
            [],
          qualifications: userData.qualifications ? 
            (typeof userData.qualifications === 'string' ? 
              userData.qualifications.split(',').map(item => item.trim()) : 
              Array.isArray(userData.qualifications) ? userData.qualifications : []) : 
            []
        };
        
        console.log('Formatted data:', formattedData);
        setExpertData(formattedData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data. Using mock data instead.');
        // Use mock data as fallback
        setExpertData(mockExpertData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = (type = 'profile') => {
    setEditType(type);
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
      if (editType === 'profile') {
        console.log('Updating basic info with:', updatedData);
        // For basic info, map to the correct backend field names
        dataToSend.first_name = updatedData.name;
        dataToSend.email = updatedData.email;
        dataToSend.gender = updatedData.gender;
      } else {
        console.log('Updating expert details with:', updatedData);
        // For expert details, map to the correct backend field names
        dataToSend.specialization = updatedData.specialization;
        dataToSend.expertise = Array.isArray(updatedData.expertise) ? updatedData.expertise.join(', ') : updatedData.expertise;
        dataToSend.qualifications = Array.isArray(updatedData.qualifications) ? updatedData.qualifications.join(', ') : updatedData.qualifications;
      }
      
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
        name: refreshedData.first_name || refreshedData.username || 'Expert',
        email: refreshedData.email || 'No email provided',
        gender: refreshedData.gender || '',
        specialization: refreshedData.specialization || 'Not specified',
        title: refreshedData.title || 'Career Advisor',
        expertise: refreshedData.expertise ? 
          (typeof refreshedData.expertise === 'string' ? 
            refreshedData.expertise.split(',').map(item => item.trim()) : 
            Array.isArray(refreshedData.expertise) ? refreshedData.expertise : []) : 
          [],
        qualifications: refreshedData.qualifications ? 
          (typeof refreshedData.qualifications === 'string' ? 
            refreshedData.qualifications.split(',').map(item => item.trim()) : 
            Array.isArray(refreshedData.qualifications) ? refreshedData.qualifications : []) : 
          []
      };
      
      // Update the local state with the formatted data
      setExpertData(formattedData);
      
      // Close the edit dialog
      setOpenEditProfile(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        name={expertData?.name || 'Expert'}
        title={expertData?.title || 'Expert'}
        onEditClick={() => handleEditProfile('profile')}
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
          {/* Combined Card */}
          <Grid item xs={12} md={10} lg={9}>
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
                <Grid container spacing={4}>
                  {/* Basic Info Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      borderRight: { md: '1px solid rgba(255, 255, 255, 0.1)' }, 
                      pr: { md: 4 },
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontSize: '1.25rem' }}>Basic Info</Typography>
                        <Button
                          onClick={() => handleEditProfile('profile')}
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
                      <List sx={{ py: 2 }}>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon>
                            <EmailIcon sx={{ color: '#00E5FF', fontSize: '1.3rem' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>Email</Typography>} 
                            secondary={<Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>{expertData?.email}</Typography>} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon>
                            <SchoolIcon sx={{ color: '#00E5FF', fontSize: '1.3rem' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>Gender</Typography>}
                            secondary={<Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
                              {expertData?.gender ? (expertData.gender.charAt(0).toUpperCase() + expertData.gender.slice(1)) : 'Not specified'}
                            </Typography>}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>
                  
                  {/* Expert Info Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ pl: { md: 4 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontSize: '1.25rem' }}>Expert Details</Typography>
                        <Button
                          onClick={() => handleEditProfile('expertise')}
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
                      <List sx={{ py: 2 }}>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>Specialization</Typography>}
                            secondary={<Typography sx={{ color: '#00E5FF', fontWeight: 600, fontSize: '1.1rem' }}>{expertData?.specialization || 'Not specified'}</Typography>}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>Expertise</Typography>}
                            secondary={
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {expertData?.expertise?.map((item, index) => (
                                  <Chip 
                                    key={index} 
                                    label={item} 
                                    size="small" 
                                    sx={{ 
                                      backgroundColor: 'rgba(0, 229, 255, 0.1)', 
                                      color: '#00E5FF',
                                      border: '1px solid rgba(0, 229, 255, 0.3)'
                                    }} 
                                  />
                                )) || 'None specified'}
                              </Box>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>Qualifications</Typography>}
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                {expertData?.qualifications?.map((item, index) => (
                                  <Typography key={index} sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', mb: 0.5 }}>
                                    • {item}
                                  </Typography>
                                )) || 'None specified'}
                              </Box>
                            }
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <EditProfileDialog
        open={openEditProfile}
        onClose={handleCloseEditProfile}
        userData={expertData}
        onSave={handleSaveProfile}
        editType={editType}
      />
    </Box>
  );

  return (
    <BaseLayout role={role || "expert"}>
      {content}
    </BaseLayout>
  );
}

export default ExpertProfile;
