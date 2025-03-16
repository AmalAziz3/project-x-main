import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';
import { cardStyles } from '../layout/baseStyles';

// Mock user data
const mockUserData = {
  admin: {
    name: 'John Admin',
    email: 'admin@example.com',
    phone: '+1 234 567 8900',
    department: 'IT Administration',
    joinDate: '2023-01-15',
    role: 'Administrator',
    managedUsers: 150,
  },
  expert: {
    name: 'Dr. Sarah Expert',
    email: 'expert@example.com',
    phone: '+1 234 567 8901',
    specialization: 'Computer Science',
    joinDate: '2023-02-20',
    role: 'Career Expert',
    publishedAnnouncements: 45,
  },
  student: {
    name: 'Mike Student',
    email: 'student@example.com',
    phone: '+1 234 567 8902',
    major: 'Undecided',
    grade: '12th Grade',
    joinDate: '2023-09-01',
    role: 'Student',
    completedQuestionnaires: 3,
  },
};

function EditProfileDialog({ open, onClose, userData, onSave }) {
  const [formData, setFormData] = useState(userData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ProfileContent() {
  const { role } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData[role]);
  const [formData, setFormData] = useState(userData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Reset form data when dialog opens
  React.useEffect(() => {
    if (isEditing) {
      setFormData(userData);
    }
  }, [isEditing, userData]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Profile
      </Typography>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={cardStyles.default}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 3,
                  }}
                >
                  {getInitials(userData.name)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" component="div">
                      {userData.name}
                    </Typography>
                    <IconButton
                      onClick={() => setIsEditing(true)}
                      sx={{ ml: 2 }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {userData.role}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={cardStyles.default}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={userData.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Phone" secondary={userData.phone} />
                </ListItem>
                {role === 'admin' && (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Department"
                        secondary={userData.department}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Managed Users"
                        secondary={userData.managedUsers}
                      />
                    </ListItem>
                  </>
                )}
                {role === 'expert' && (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Specialization"
                        secondary={userData.specialization}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Published Announcements"
                        secondary={userData.publishedAnnouncements}
                      />
                    </ListItem>
                  </>
                )}
                {role === 'student' && (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Major"
                        secondary={userData.major}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Grade"
                        secondary={userData.grade}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Completed Questionnaires"
                        secondary={userData.completedQuestionnaires}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Dialog 
        open={isEditing} 
        onClose={() => setIsEditing(false)}
      >
        <DialogTitle>Edit Profile</DialogTitle>
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsEditing(false)}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Profile() {
  const { role } = useSelector((state) => state.auth);
  
  return (
    <BaseLayout role={role}>
      <ProfileContent />
    </BaseLayout>
  );
}

export default Profile; 
