import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Fade,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Announcement as AnnouncementIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import BaseLayout from '../Layout/BaseLayout';

// Mock data for an announcement
const mockAnnouncement = {
  id: 1,
  title: 'Important System Update',
  content: 'We will be performing system maintenance on Saturday, July 15th. The platform will be unavailable from 2:00 AM to 4:00 AM.',
  date: new Date(),
  author: 'System Administrator',
  audience: 'all',
  tags: ['System', 'Maintenance', 'Update'],
};

function PostAnnouncement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get ID from URL params
  const { role } = useSelector((state) => state.auth);
  
  // Check if we're editing an existing announcement
  const announcementId = id || (location.state && location.state.announcement && location.state.announcement.id);
  const isEditing = !!announcementId;
  
  // State for announcement data
  const [announcement, setAnnouncement] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [audience, setAudience] = useState('all');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  
  // Load announcement data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      // In a real app, this would fetch from an API
      // For now, we'll use mock data
      try {
        console.log("Fetching announcement with ID:", announcementId);
        // Simulate API call
        setTimeout(() => {
          setAnnouncement(mockAnnouncement);
          setTitle(mockAnnouncement.title);
          setContent(mockAnnouncement.content);
          setDate(mockAnnouncement.date);
          setAudience(mockAnnouncement.audience);
          setTags(mockAnnouncement.tags);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching announcement:', err);
        setError('Failed to load announcement details. Please try again later.');
        setLoading(false);
      }
    }
  }, [isEditing, announcementId]);
  
  const handleSave = () => {
    // In a real app, this would send data to an API
    const announcementData = {
      title,
      content,
      date,
      audience,
      tags,
    };
    
    if (isEditing) {
      announcementData.id = announcementId;
      console.log('Updating announcement:', announcementData);
    } else {
      console.log('Creating new announcement:', announcementData);
    }
    
    // Navigate back to announcements
    navigate('/announcements');
  };
  
  const handleDelete = () => {
    // In a real app, this would send a delete request to an API
    console.log('Deleting announcement:', announcementId);
    
    // Navigate back to announcements
    navigate('/announcements');
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
              onClick={() => navigate('/announcements')}
            >
              Back to Announcements
            </Button>
          </Paper>
        </Box>
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
                onClick={() => navigate('/announcements')}
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
                {isEditing ? 'Edit Announcement' : 'Post Announcement'}
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
                    label="Title"
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
                    label="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                
                <Grid item xs={12} sm={6}>
                  <FormControl 
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
                      '& .MuiSelect-icon': {
                        color: '#00E5FF',
                      },
                    }}
                  >
                    <InputLabel>Audience</InputLabel>
                    <Select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      label="Audience"
                    >
                      <MenuItem value="all">All Users</MenuItem>
                      <MenuItem value="students">Students Only</MenuItem>
                      <MenuItem value="experts">Experts Only</MenuItem>
                      <MenuItem value="admins">Admins Only</MenuItem>
                    </Select>
                  </FormControl>
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
              {isEditing && (
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
                  Delete Announcement
                </Button>
              )}
              
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  ml: isEditing ? 0 : 'auto',
                  backgroundColor: '#00E5FF',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 229, 255, 0.8)',
                  },
                }}
              >
                {isEditing ? 'Save Changes' : 'Post Announcement'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </BaseLayout>
  );
}

export default PostAnnouncement; 
