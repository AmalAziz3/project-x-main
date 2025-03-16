import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import { getAllLectures, updateLecture, deleteLecture } from '../../services/lectureService';

// Remove mock data
// const mockLectures = [ ... ];

function LectureManagement() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [editedLecture, setEditedLecture] = useState({
    title: '',
    description: '',
    duration: '',
    expert: '',
    category: '',
  });
  
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

  const handleJoinLecture = (lectureId) => {
    const lecture = lectures.find((l) => l.id === lectureId);
    if (lecture?.zoom_link) {
      window.open(lecture.zoom_link, '_blank');
    } else {
      console.error('No Zoom link available for this lecture');
    }
  };

  const handleEditClick = (lecture) => {
    setSelectedLecture(lecture);
    setEditedLecture({
      title: lecture.title,
      description: lecture.description,
      duration: lecture.duration,
      expert: lecture.expert,
      category: lecture.category,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      
      // Format the data for the API
      const lectureData = {
        ...selectedLecture,
        title: editedLecture.title,
        description: editedLecture.description,
        duration: editedLecture.duration,
        expert: editedLecture.expert,
        category: editedLecture.category,
      };
      
      // Call the API to update the lecture
      await updateLecture(selectedLecture.id, lectureData);
      
      // Update the lectures list
      setLectures(lectures.map((lecture) =>
        lecture.id === selectedLecture.id
          ? { ...lecture, ...editedLecture }
          : lecture
      ));
      
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating lecture:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (lecture) => {
    setSelectedLecture(lecture);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      
      // Call the API to delete the lecture
      await deleteLecture(selectedLecture.id);
      
      // Update the lectures list
      setLectures(lectures.filter((lecture) => lecture.id !== selectedLecture.id));
      
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting lecture:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#00E5FF' }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {lectures.map((lecture) => (
          <Grid item xs={12} md={6} lg={4} key={lecture.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
                overflow: 'hidden',
                borderRadius: 2,
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={lecture.image}
                alt={lecture.title}
                sx={{
                  opacity: 0.6,
                }}
              />
              <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" gutterBottom component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {lecture.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  {lecture.description}
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 20, color: '#00E5FF' }} />
                    <Typography variant="body2" sx={{ color: '#00E5FF' }}>
                      {lecture.expert}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 20, color: '#00E5FF' }} />
                    <Typography variant="body2" sx={{ color: '#00E5FF' }}>
                      {lecture.duration}
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#00E5FF', mb: 1 }}>
                    {lecture.category}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<VideoCallIcon />}
                    onClick={() => handleJoinLecture(lecture.id)}
                    sx={{
                      bgcolor: '#00E5FF',
                      color: 'black',
                      '&:hover': {
                        bgcolor: '#00B8D4',
                      },
                      mb: 2,
                    }}
                  >
                    Join Lecture
                  </Button>
                  <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(lecture)}
                      sx={{
                        borderColor: '#00E5FF',
                        color: '#00E5FF',
                        '&:hover': {
                          borderColor: '#00B8D4',
                          bgcolor: 'rgba(0, 229, 255, 0.1)',
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(lecture)}
                      sx={{
                        borderColor: '#ff4444',
                        color: '#ff4444',
                        '&:hover': {
                          borderColor: '#ff0000',
                          bgcolor: 'rgba(255, 68, 68, 0.1)',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Lecture</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editedLecture.title}
            onChange={(e) => setEditedLecture({ ...editedLecture, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editedLecture.description}
            onChange={(e) => setEditedLecture({ ...editedLecture, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Duration"
            fullWidth
            value={editedLecture.duration}
            onChange={(e) => setEditedLecture({ ...editedLecture, duration: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Expert"
            fullWidth
            value={editedLecture.expert}
            onChange={(e) => setEditedLecture({ ...editedLecture, expert: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={editedLecture.category}
            onChange={(e) => setEditedLecture({ ...editedLecture, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#ff4444' }}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} sx={{ color: '#00E5FF' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Lecture</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedLecture?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#00E5FF' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} sx={{ color: '#ff4444' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LectureManagement; 
