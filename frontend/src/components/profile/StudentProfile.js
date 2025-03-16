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
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BaseLayout from '../Layout/BaseLayout';
import Header from '../Layout/Header';
import { getUserProfile, updateUserProfile } from '../../services/userService';

// Mock student data for fallback
const mockStudentData = {
  name: 'Mike Student',
  email: 'student@example.com',
  gender: 'male',
  title: 'Student',
  stats: {
    gat: '85.5',
    saath: '1250',
    highSchoolGpa: '92.3'
  }
};

function EditProfileDialog({ open, onClose, userData, onSave, editType }) {
  // Initialize formData with userData when the component mounts
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    title: 'Student',
    stats: {
      gat: '',
      saath: '',
      highSchoolGpa: ''
    }
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
    
    if (editType === 'stats') {
      setFormData({
        ...formData,
        stats: {
          ...formData.stats,
          [name]: value
        }
      });
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
    if (editType === 'stats') {
      return (
        <>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="GAT Score"
              name="gat"
              value={formData.stats.gat}
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
              label="SAATH Score"
              name="saath"
              value={formData.stats.saath}
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
              label="High School GPA"
              name="highSchoolGpa"
              value={formData.stats.highSchoolGpa}
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
            </Select>
          </FormControl>
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
        {editType === 'stats' ? 'Edit Academic Stats' : 'Edit Student Profile'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {renderFields()}
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

function StudentProfile() {
  // const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
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
          name: userData.first_name || userData.username || 'Student',
          email: userData.email || 'No email provided',
          gender: userData.gender || '',
          title: 'Student',
          stats: {
            gat: userData.gat_score || 'N/A',
            saath: userData.saath_score || 'N/A',
            highSchoolGpa: userData.high_school_gpa || 'N/A'
          }
        };
        
        console.log('Formatted data for UI:', formattedData);
        
        setStudentData(formattedData);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile data. Please try again later.');
        // Fallback to mock data if API fails
        setStudentData(mockStudentData);
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
    setEditType('profile');
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
        console.log('Updating academic stats with:', updatedData.stats);
        // For academic stats, map to the correct backend field names
        dataToSend.gat_score = updatedData.stats.gat;
        dataToSend.saath_score = updatedData.stats.saath;
        dataToSend.high_school_gpa = updatedData.stats.highSchoolGpa;
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
        name: refreshedData.first_name || refreshedData.username || 'Student',
        email: refreshedData.email || 'No email provided',
        gender: refreshedData.gender || '',
        title: 'Student',
        stats: {
          gat: refreshedData.gat_score || 'N/A',
          saath: refreshedData.saath_score || 'N/A',
          highSchoolGpa: refreshedData.high_school_gpa || 'N/A'
        }
      };
      
      console.log('Formatted data after refresh:', formattedData);
      
      // Update local state with the refreshed data
      setStudentData(formattedData);
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
  if (loading && !studentData) {
    return (
      <BaseLayout role={role || "student"}>
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
        name={studentData?.name || 'Student'}
        title={studentData?.title || 'Student'}
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
                            secondary={<Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>{studentData?.email}</Typography>} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon>
                            <SchoolIcon sx={{ color: '#00E5FF', fontSize: '1.3rem' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>Gender</Typography>}
                            secondary={<Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
                              {studentData?.gender ? (studentData.gender.charAt(0).toUpperCase() + studentData.gender.slice(1)) : 'Not specified'}
                            </Typography>}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>

                  {/* Academic Stats Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ pl: { md: 4 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontSize: '1.25rem' }}>Academic Stats</Typography>
                        <Button
                          onClick={() => handleEditProfile('stats')}
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
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>GAT Score</Typography>}
                            secondary={<Typography sx={{ color: '#00E5FF', fontWeight: 600, fontSize: '1.1rem' }}>{studentData?.stats?.gat}%</Typography>}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>SAATH Score</Typography>}
                            secondary={<Typography sx={{ color: '#00E5FF', fontWeight: 600, fontSize: '1.1rem' }}>{studentData?.stats?.saath}</Typography>}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary={<Typography sx={{ color: 'white', fontSize: '1rem' }}>High School GPA</Typography>}
                            secondary={<Typography sx={{ color: '#00E5FF', fontWeight: 600, fontSize: '1.1rem' }}>{studentData?.stats?.highSchoolGpa}%</Typography>}
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
        userData={studentData}
        onSave={handleSaveProfile}
        editType={editType}
      />
    </Box>
  );

  return (
    <BaseLayout role={role || "student"}>
      {content}
    </BaseLayout>
  );
}

export default StudentProfile;
