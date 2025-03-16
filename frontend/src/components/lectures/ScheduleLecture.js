import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Fade,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import BaseLayout from '../Layout/BaseLayout';
import { createLecture } from '../../services/lectureService';

function ScheduleLecture() {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  
  // State for lecture data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [location, setLocation] = useState('');
  const [lectureUrl, setLectureUrl] = useState('');
  const [expertName, setExpertName] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const handleSchedule = async () => {
    // Validate form
    if (!title || !description || !date || !startTime || !endTime || !location) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Format the data for the API
      const lectureData = {
        title,
        description,
        date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        start_time: startTime.toTimeString().split(' ')[0], // Format as HH:MM:SS
        end_time: endTime.toTimeString().split(' ')[0], // Format as HH:MM:SS
        location,
        lecture_url: formatUrl(lectureUrl),
        expert_name: expertName,
        tags,
      };
      
      // Call the API to create the lecture
      await createLecture(lectureData);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Lecture scheduled successfully',
        severity: 'success'
      });
      
      // Navigate back to view lectures
      navigate('/view-lectures');
    } catch (err) {
      console.error('Error scheduling lecture:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to schedule lecture. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Helper function to format URL with https:// if needed
  const formatUrl = (url) => {
    if (!url) return '';
    if (url.match(/^https?:\/\//)) return url;
    return `https://${url}`;
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
                Schedule New Lecture
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
                    rows={4}
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
                
                <Grid item xs={12} md={6}>
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleSchedule}
                sx={{
                  backgroundColor: '#00E5FF',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 229, 255, 0.8)',
                  },
                }}
              >
                Schedule Lecture
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BaseLayout>
  );
}

export default ScheduleLecture; 
