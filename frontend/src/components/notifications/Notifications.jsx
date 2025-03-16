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
  CardActions,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Announcement as AnnouncementIcon,
  Notifications as NotificationsIcon,
  Support as SupportIcon,
  AdminPanelSettings as AdminIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function Notifications() {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    type: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    console.log('Notifications component mounted');
    document.title = 'Notifications';
  }, []);

  const handleBack = () => {
    if (role === 'admin') {
      navigate('/home/admin');
    } else if (role === 'expert') {
      navigate('/home/expert');
    } else {
      navigate('/home/student');
    }
  };

  // Dummy notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'announcement',
      title: 'System Update Complete',
      content: 'The platform has been successfully updated with new features and performance improvements.',
      date: '2023-05-15',
      sender: 'System'
    },
    {
      id: 2,
      type: 'admin',
      title: 'New User Registrations',
      content: 'There are 5 new user registrations pending approval. Please review them in the user management section.',
      date: '2023-05-14',
      sender: 'Admin'
    },
    {
      id: 3,
      type: 'support',
      title: 'Support Request Resolved',
      content: 'Your recent support request regarding account access has been resolved. Please let us know if you need further assistance.',
      date: '2023-05-13',
      sender: 'Support Team'
    },
  ]);

  const getIconByType = (type) => {
    switch (type) {
      case 'announcement':
        return <AnnouncementIcon />;
      case 'admin':
        return <AdminIcon />;
      case 'support':
        return <SupportIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const handleEditClick = (notification) => {
    // Navigate to edit announcement page with the ID in the URL path
    navigate(`/edit-announcement/${notification.id}`);
  };

  const handleDeleteClick = (notification) => {
    setCurrentNotification(notification);
    setDeleteDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSave = () => {
    // Update the notification in the state
    const updatedNotifications = notifications.map(notification => 
      notification.id === currentNotification.id 
        ? { ...notification, ...editFormData } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    setEditDialogOpen(false);
    
    setSnackbar({
      open: true,
      message: 'Notification updated successfully!',
      severity: 'success'
    });
  };

  const handleDeleteConfirm = () => {
    // Remove the notification from the state
    const updatedNotifications = notifications.filter(
      notification => notification.id !== currentNotification.id
    );
    
    setNotifications(updatedNotifications);
    setDeleteDialogOpen(false);
    
    setSnackbar({
      open: true,
      message: 'Notification deleted successfully!',
      severity: 'success'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const isAdminOrExpert = role === 'admin' || role === 'expert';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/Background.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      pb: 7,
      pt: 2,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={handleBack} 
            sx={{ 
              color: 'white', 
              mr: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
            Notifications
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {notifications.map((notification) => (
            <Grid item xs={12} key={notification.id}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 
                          notification.type === 'announcement' ? 'primary.main' : 
                          notification.type === 'admin' ? 'error.main' : 'secondary.main', 
                        mr: 2 
                      }}
                    >
                      {getIconByType(notification.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.date} • From: {notification.sender}
                      </Typography>
                    </Box>
                    <Chip 
                      label={
                        notification.type === 'announcement' ? 'Announcement' : 
                        notification.type === 'admin' ? 'Admin' : 'Support'
                      } 
                      color={
                        notification.type === 'announcement' ? 'primary' : 
                        notification.type === 'admin' ? 'error' : 'secondary'
                      }
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                    {isAdminOrExpert && (
                      <Box sx={{ display: 'flex', ml: 2 }}>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleEditClick(notification)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteClick(notification)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {notification.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">Mark as Read</Button>
                  {notification.type === 'admin' && (
                    <Button size="small" color="primary">Take Action</Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Notification</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={editFormData.title}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={editFormData.content}
            onChange={handleEditChange}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            select
            fullWidth
            label="Type"
            name="type"
            value={editFormData.type}
            onChange={handleEditChange}
            margin="normal"
          >
            <MenuItem value="announcement">Announcement</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="support">Support</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Notification</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this notification? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Notifications; 