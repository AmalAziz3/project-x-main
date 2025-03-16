import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Link,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime,
  Event as EventIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Support as SupportIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  Group as GroupIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';
import { getAllLectures, deleteLecture, registerForLecture, unregisterFromLecture } from '../../services/lectureService';

function ViewLectures() {
  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // Fetch lectures when component mounts
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const data = await getAllLectures();
        setLectures(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching lectures:', err);
        setError('Failed to load lectures. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  const handleEdit = (lecture) => {
    navigate(`/edit-lecture/${lecture.id}`, { state: { lecture } });
  };

  const handleDeleteClick = (lecture) => {
    setSelectedLecture(lecture);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteDialogOpen(false);
      await deleteLecture(selectedLecture.id);
      
      // Update the lectures list after successful deletion
      setLectures(lectures.filter(lecture => lecture.id !== selectedLecture.id));
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Lecture deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting lecture:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete lecture. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleRegisterForLecture = async (lectureId) => {
    try {
      setRegistrationLoading(true);
      await registerForLecture(lectureId);
      
      // Update the lectures list to reflect registration
      const updatedLectures = lectures.map(lecture => 
        lecture.id === lectureId 
          ? { ...lecture, registration_count: lecture.registration_count + 1, isRegistered: true } 
          : lecture
      );
      setLectures(updatedLectures);
      
      setSnackbar({
        open: true,
        message: 'Successfully registered for the lecture',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error registering for lecture:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to register for the lecture',
        severity: 'error'
      });
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleUnregisterFromLecture = async (lectureId) => {
    try {
      setRegistrationLoading(true);
      await unregisterFromLecture(lectureId);
      
      // Update the lectures list to reflect unregistration
      const updatedLectures = lectures.map(lecture => 
        lecture.id === lectureId 
          ? { ...lecture, registration_count: lecture.registration_count - 1, isRegistered: false } 
          : lecture
      );
      setLectures(updatedLectures);
      
      setSnackbar({
        open: true,
        message: 'Successfully unregistered from the lecture',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error unregistering from lecture:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to unregister from the lecture',
        severity: 'error'
      });
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleJoinLecture = (lectureUrl) => {
    if (lectureUrl) {
      // Ensure URL has a protocol prefix
      let url = lectureUrl;
      if (!url.match(/^https?:\/\//)) {
        url = `https://${url}`;
      }
      window.open(url, '_blank');
    } else {
      setSnackbar({
        open: true,
        message: 'No lecture URL available',
        severity: 'info'
      });
    }
  };

  // Helper function to format URL for display
  const formatUrlForDisplay = (url) => {
    if (!url) return '';
    // Remove protocol and trailing slashes for display
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Different content based on role
  let content;
  
  if (loading) {
    content = (
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
    );
  } else if (error) {
    content = (
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
        <Paper sx={{ p: 3, maxWidth: 600, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
          <Typography variant="h5" color="error" gutterBottom>Error</Typography>
          <Typography>{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2, bgcolor: '#00E5FF', color: 'black' }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  } else {
    content = (
      <Box sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        pb: 7,
      }}>
        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, gap: 2 }}>
          {role === 'student' && (
            <Button 
              variant="contained" 
              startIcon={<HomeIcon />}
              onClick={() => navigate('/home/student')}
              sx={{ 
                bgcolor: 'rgba(0, 229, 255, 0.1)', 
                color: '#00E5FF',
                '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.2)' },
                borderRadius: 2,
              }}
            >
              Home
            </Button>
          )}
          {role === 'admin' && (
            <Button 
              variant="contained" 
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/home/admin')}
              sx={{ 
                bgcolor: 'rgba(0, 229, 255, 0.1)', 
                color: '#00E5FF',
                '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.2)' },
                borderRadius: 2,
              }}
            >
              Dashboard
            </Button>
          )}
          {role === 'expert' && (
            <Button 
              variant="contained" 
              startIcon={<SupportIcon />}
              onClick={() => navigate('/expert-support')}
              sx={{ 
                bgcolor: 'rgba(0, 229, 255, 0.1)', 
                color: '#00E5FF',
                '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.2)' },
                borderRadius: 2,
              }}
            >
              Support
            </Button>
          )}
          {(role === 'admin' || role === 'expert') && (
            <Button 
              variant="contained"
              onClick={() => navigate('/schedule-lecture')}
              sx={{ 
                bgcolor: '#00E5FF', 
                color: 'black',
                '&:hover': { bgcolor: '#00B8D4' },
                borderRadius: 2,
              }}
            >
              Schedule New Lecture
            </Button>
          )}
        </Box>
        
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Typography variant="h3" sx={{ 
            color: '#00E5FF',
            mb: 4,
            textAlign: 'center',
            fontWeight: 600,
            textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
          }}>
            Available Lectures
          </Typography>

          {lectures.length === 0 ? (
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                No lectures found
              </Typography>
              {(role === 'admin' || role === 'expert') && (
                <Button 
                  variant="contained"
                  onClick={() => navigate('/schedule-lecture')}
                  sx={{ 
                    bgcolor: '#00E5FF', 
                    color: 'black',
                    '&:hover': { bgcolor: '#00B8D4' },
                  }}
                >
                  Schedule Your First Lecture
                </Button>
              )}
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {lectures.map((lecture) => (
                <Grid item xs={12} key={lecture.id}>
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
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h5" sx={{ color: '#ffffff', mb: 1 }}>
                            {lecture.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                            {lecture.description}
                          </Typography>
                        </Box>
                        {(role === 'admin' || role === 'expert') && (
                          <Box>
                            <IconButton 
                              onClick={() => handleEdit(lecture)}
                              sx={{ 
                                color: '#00E5FF',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 229, 255, 0.1)',
                                },
                                mr: 1 
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteClick(lecture)}
                              sx={{ 
                                color: '#00E5FF',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 229, 255, 0.1)',
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      
                      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon sx={{ color: '#00E5FF', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              {lecture.scheduled_for || lecture.scheduledFor}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTime sx={{ color: '#00E5FF', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              {lecture.duration}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationIcon sx={{ color: '#00E5FF', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              {lecture.location}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ color: '#00E5FF', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              {lecture.expert_name || 'No expert assigned'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {lecture.lecture_url && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                          <LinkIcon sx={{ color: '#00E5FF', mr: 1 }} />
                          <Link 
                            href={lecture.lecture_url.match(/^https?:\/\//) ? lecture.lecture_url : `https://${lecture.lecture_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ 
                              color: '#00E5FF',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {formatUrlForDisplay(lecture.lecture_url)}
                          </Link>
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <GroupIcon sx={{ color: '#00E5FF', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {lecture.registration_count || 0} {lecture.registration_count === 1 ? 'student' : 'students'} registered
                        </Typography>
                      </Box>
                      
                      {lecture.tags && lecture.tags.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          <TagIcon sx={{ color: '#00E5FF', mr: 1 }} />
                          {lecture.tags.map((tag, index) => (
                            <Chip 
                              key={index} 
                              label={tag} 
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(0, 229, 255, 0.1)', 
                                color: '#00E5FF',
                                borderRadius: '4px',
                              }} 
                            />
                          ))}
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        {role === 'student' && (
                          <Button 
                            variant="outlined"
                            onClick={() => lecture.isRegistered 
                              ? handleUnregisterFromLecture(lecture.id)
                              : handleRegisterForLecture(lecture.id)
                            }
                            disabled={registrationLoading || lecture.status === 'Completed'}
                            sx={{ 
                              borderColor: '#00E5FF',
                              color: '#00E5FF',
                              '&:hover': {
                                borderColor: '#00E5FF',
                                bgcolor: 'rgba(0, 229, 255, 0.1)',
                              },
                            }}
                          >
                            {lecture.isRegistered ? 'Unregister' : 'Register'}
                          </Button>
                        )}
                        
                        <Tooltip title={!lecture.lecture_url ? "No lecture URL available" : ""}>
                          <span>
                            <Button 
                              variant="contained"
                              onClick={() => handleJoinLecture(lecture.lecture_url)}
                              disabled={!lecture.lecture_url || lecture.status === 'Completed'}
                              sx={{ 
                                bgcolor: lecture.status === 'Completed' ? 'rgba(255, 255, 255, 0.2)' : '#00E5FF',
                                color: lecture.status === 'Completed' ? 'rgba(255, 255, 255, 0.7)' : 'black',
                                '&:hover': {
                                  bgcolor: lecture.status === 'Completed' ? 'rgba(255, 255, 255, 0.3)' : '#00B8D4',
                                },
                                pointerEvents: lecture.status === 'Completed' ? 'none' : 'auto',
                              }}
                            >
                              {lecture.status === 'Completed' ? 'Completed' : 'Join Lecture'}
                            </Button>
                          </span>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    );
  }

  return (
    <BaseLayout role={role}>
      {content}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#00E5FF' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this lecture? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            sx={{ color: '#FF5252' }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BaseLayout>
  );
}

export default ViewLectures; 
