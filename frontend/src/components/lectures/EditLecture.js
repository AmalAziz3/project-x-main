import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Grid, Chip, Paper, IconButton, Fade, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DateTimePicker, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';
import { getLectureById, updateLecture, deleteLecture } from '../../services/lectureService';

// Commented out unused imports
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';

// Mock lecture data for demonstration
// const mockLecture = { ... };

function EditLecture() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get ID from URL params
  const { role } = useSelector((state) => state.auth);
  
  // Use the ID from URL params, or from location state if available
  const lectureId = id || (location.state && location.state.lecture && location.state.lecture.id);
  
  // State for lecture data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [lectureLocation, setLectureLocation] = useState('');
  const [lectureUrl, setLectureUrl] = useState('');
  const [expertName, setExpertName] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  
  // State for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lecture, setLecture] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fetch lecture data when component mounts
  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        console.log("Fetching lecture with ID:", lectureId);
        const data = await getLectureById(lectureId);
        console.log("Lecture data received:", data);
        setLecture(data);
        
        // Populate form fields
        setTitle(data.title);
        setDescription(data.description);
        setDate(new Date(data.date));
        setStartTime(new Date(`2000-01-01T${data.start_time}`));
        setEndTime(new Date(`2000-01-01T${data.end_time}`));
        setLectureLocation(data.location);
        setLectureUrl(data.lecture_url || '');
        setExpertName(data.expert_name || '');
        setTags(data.tags || []);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching lecture:', err);
        setError('Failed to load lecture details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (lectureId) {
      fetchLecture();
    } else {
      console.error("No lecture ID found in URL params or location state");
      setError("No lecture ID provided. Please go back and try again.");
      setLoading(false);
    }
  }, [lectureId]);
  
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Format the data for the API
      const lectureData = {
        title,
        description,
        date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        start_time: startTime.toTimeString().split(' ')[0], // Format as HH:MM:SS
        end_time: endTime.toTimeString().split(' ')[0], // Format as HH:MM:SS
        location: lectureLocation,
        lecture_url: formatUrl(lectureUrl),
        expert_name: expertName,
        tags,
      };
      
      // Call the API to update the lecture
      await updateLecture(lectureId, lectureData);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Lecture updated successfully',
        severity: 'success'
      });
      
      // Navigate back to view lectures
      navigate('/view-lectures');
    } catch (err) {
      console.error('Error updating lecture:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update lecture. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to format URL with https:// if needed
  const formatUrl = (url) => {
    if (!url) return '';
    if (url.match(/^https?:\/\//)) return url;
    return `https://${url}`;
  };
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Call the API to delete the lecture
      await deleteLecture(lectureId);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Lecture deleted successfully',
        severity: 'success'
      });
      
      // Navigate back to view lectures
      navigate('/view-lectures');
    } catch (err) {
      console.error('Error deleting lecture:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete lecture. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };
  
  if (loading) {
    return (
      <BaseLayout role={role}>
        <Box sx={{ 
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}>
          <CircularProgress sx={{ color: '#00E5FF' }} />
        </Box>
      </BaseLayout>
    );
  }
  
  if (error) {
    return (
      <BaseLayout role={role}>
        <Box sx={{ 
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}>
          <Paper sx={{ p: 4, maxWidth: 600, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
            <Typography variant="h5" color="error" gutterBottom>Error</Typography>
            <Typography>{error}</Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 3, bgcolor: '#00E5FF', color: 'black' }}
              onClick={() => navigate('/view-lectures')}
            >
              Back to Lectures
            </Button>
          </Paper>
        </Box>
      </BaseLayout>
    );
  }
  
  if (!lecture) {
    return (
      <BaseLayout role={role}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography>No lecture data found. Please try again.</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 3, bgcolor: '#00E5FF', color: 'black' }}
            onClick={() => navigate('/view-lectures')}
          >
            Back to Lectures
          </Button>
        </Container>
      </BaseLayout>
    );
  }
  
  return (
    <BaseLayout role={role}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        }}
      />
      <Container maxWidth="md" sx={{ py: 6, pb: 10 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <IconButton 
                onClick={() => navigate('/view-lectures')}
                sx={{ 
                  mr: 2, 
                  color: '#00E5FF',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: '#00E5FF',
                  fontWeight: 700,
                  textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
                }}
              >
                Edit Lecture
              </Typography>
            </Box>
            
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                border: '1px solid rgba(0, 229, 255, 0.3)',
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Lecture Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00E5FF',
                        },
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#00E5FF',
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={6}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00E5FF',
                        },
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#00E5FF',
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={date}
                      onChange={(newDate) => setDate(newDate)}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(0, 229, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(0, 229, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#00E5FF',
                              },
                              color: 'white',
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&.Mui-focused': {
                                color: '#00E5FF',
                              },
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#00E5FF',
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Start Time"
                      value={startTime}
                      onChange={(newTime) => setStartTime(newTime)}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(0, 229, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(0, 229, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#00E5FF',
                              },
                              color: 'white',
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&.Mui-focused': {
                                color: '#00E5FF',
                              },
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#00E5FF',
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="End Time"
                      value={endTime}
                      onChange={(newTime) => setEndTime(newTime)}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(0, 229, 255, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(0, 229, 255, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#00E5FF',
                              },
                              color: 'white',
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&.Mui-focused': {
                                color: '#00E5FF',
                              },
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#00E5FF',
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={lectureLocation}
                    onChange={(e) => setLectureLocation(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00E5FF',
                        },
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#00E5FF',
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Lecture URL"
                    value={lectureUrl}
                    onChange={(e) => setLectureUrl(e.target.value)}
                    variant="outlined"
                    placeholder="example.com or https://example.com"
                    helperText="https:// will be added automatically if not provided"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00E5FF',
                        },
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#00E5FF',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expert Name"
                    value={expertName}
                    onChange={(e) => setExpertName(e.target.value)}
                    variant="outlined"
                    placeholder="Dr. John Smith"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00E5FF',
                        },
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#00E5FF',
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 1, 
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 500,
                    }}
                  >
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        sx={{
                          backgroundColor: 'rgba(0, 229, 255, 0.1)',
                          color: '#00E5FF',
                          borderRadius: '4px',
                          '& .MuiChip-deleteIcon': {
                            color: 'rgba(0, 229, 255, 0.7)',
                            '&:hover': {
                              color: '#00E5FF',
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Add Tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 229, 255, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0, 229, 255, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#00E5FF',
                          },
                          color: 'white',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#00E5FF',
                          },
                        },
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddTag}
                      sx={{
                        borderColor: '#00E5FF',
                        color: '#00E5FF',
                        '&:hover': {
                          borderColor: '#00E5FF',
                          backgroundColor: 'rgba(0, 229, 255, 0.1)',
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                  borderColor: '#FF4081',
                  color: '#FF4081',
                  '&:hover': {
                    borderColor: '#FF4081',
                    backgroundColor: 'rgba(255, 64, 129, 0.1)',
                  },
                }}
              >
                Delete Lecture
              </Button>
              
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  backgroundColor: '#00E5FF',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 229, 255, 0.8)',
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </BaseLayout>
  );
}

export default EditLecture; 
