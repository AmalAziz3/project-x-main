import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Email as EmailIcon,
  Announcement as AnnouncementIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';
import { useSelector } from 'react-redux';

// Mock announcements data
const mockAnnouncements = [
  {
    id: 1,
    type: 'announcement',
    title: 'New Platform Feature',
    message: 'We have added a new feature to help you track your progress better.',
    date: '2023-06-15T10:30:00',
    read: false,
  },
  {
    id: 2,
    type: 'event',
    title: 'Upcoming Lecture',
    message: 'Don\'t forget about the AI Ethics lecture tomorrow at 2:00 PM.',
    date: '2023-06-14T15:45:00',
    read: true,
  },
  {
    id: 3,
    type: 'assignment',
    title: 'New Questionnaire Available',
    message: 'A new career assessment questionnaire is now available for you to complete.',
    date: '2023-06-13T09:15:00',
    read: false,
  },
  {
    id: 4,
    type: 'announcement',
    title: 'System Maintenance',
    message: 'The system will be down for maintenance on Sunday from 2:00 AM to 4:00 AM.',
    date: '2023-06-12T11:20:00',
    read: true,
  },
  {
    id: 5,
    type: 'event',
    title: 'Career Fair',
    message: 'Virtual career fair with top companies on June 20th. Register now!',
    date: '2023-06-10T14:00:00',
    read: false,
  },
];

function Announcements() {
  const { role } = useSelector((state) => state.auth);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedMessage, setEditedMessage] = useState('');
  const [editedType, setEditedType] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMarkAsRead = (id) => {
    setAnnouncements(
      announcements.map((announcement) =>
        announcement.id === id ? { ...announcement, read: true } : announcement
      )
    );
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setAnnouncements(
      announcements.map((announcement) => ({ ...announcement, read: true }))
    );
  };

  const handleDeleteAllRead = () => {
    setAnnouncements(announcements.filter((announcement) => !announcement.read));
  };

  // These functions are commented out as they're not currently used
  /*
  const handleEditClick = (announcement) => {
    setCurrentAnnouncement(announcement);
    setEditedTitle(announcement.title);
    setEditedMessage(announcement.message);
    setEditedType(announcement.type);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    setAnnouncements(
      announcements.map((announcement) =>
        announcement.id === currentAnnouncement.id
          ? {
              ...announcement,
              title: editedTitle,
              message: editedMessage,
              type: editedType,
            }
          : announcement
      )
    );
    setEditDialogOpen(false);
  };
  */

  const getFilteredAnnouncements = () => {
    if (activeTab === 0) return announcements;
    if (activeTab === 1) return announcements.filter((n) => !n.read);
    if (activeTab === 2) return announcements.filter((n) => n.read);
    if (activeTab === 3) return announcements.filter((n) => n.type === 'announcement');
    if (activeTab === 4) return announcements.filter((n) => n.type === 'event');
    if (activeTab === 5) return announcements.filter((n) => n.type === 'assignment');
    return announcements;
  };

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case 'announcement':
        return <AnnouncementIcon />;
      case 'event':
        return <EventIcon />;
      case 'assignment':
        return <AssignmentIcon />;
      default:
        return <EmailIcon />;
    }
  };

  const getAnnouncementColor = (type) => {
    switch (type) {
      case 'announcement':
        return '#00E5FF';
      case 'event':
        return '#FF4081';
      case 'assignment':
        return '#76FF03';
      default:
        return '#00E5FF';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = announcements.filter((n) => !n.read).length;

  return (
    <BaseLayout role={role}>
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          pt: 4,
          pb: 8,
        }}
      >
        <Container maxWidth="md">
          <Fade in={true} timeout={800}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 4,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
                    <AnnouncementIcon
                      sx={{ fontSize: 36, color: '#00E5FF' }}
                    />
                  </Badge>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      color: '#00E5FF',
                      fontWeight: 700,
                      textShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
                    }}
                  >
                    Announcements
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="Mark all as read">
                    <IconButton
                      onClick={handleMarkAllAsRead}
                      sx={{ color: '#00E5FF', mr: 1 }}
                    >
                      <MarkEmailReadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete read announcements">
                    <IconButton
                      onClick={handleDeleteAllRead}
                      sx={{ color: '#00E5FF' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Paper
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 2,
                  mb: 4,
                  overflow: 'hidden',
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    '& .MuiTab-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-selected': {
                        color: '#00E5FF',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#00E5FF',
                    },
                  }}
                >
                  <Tab label="All" />
                  <Tab
                    label={
                      <Badge badgeContent={unreadCount} color="error">
                        <Box sx={{ pr: unreadCount > 0 ? 2 : 0 }}>Unread</Box>
                      </Badge>
                    }
                  />
                  <Tab label="Read" />
                  <Tab
                    icon={<AnnouncementIcon />}
                    iconPosition="start"
                    label="Announcements"
                  />
                  <Tab
                    icon={<EventIcon />}
                    iconPosition="start"
                    label="Events"
                  />
                  <Tab
                    icon={<AssignmentIcon />}
                    iconPosition="start"
                    label="Assignments"
                  />
                </Tabs>
              </Paper>

              <List sx={{ mb: 4 }}>
                {getFilteredAnnouncements().length > 0 ? (
                  getFilteredAnnouncements().map((announcement, index) => (
                    <Fade 
                      in={true} 
                      timeout={500} 
                      style={{ transitionDelay: `${index * 100}ms` }}
                      key={announcement.id}
                    >
                      <Paper
                        sx={{
                          mb: 2,
                          backgroundColor: announcement.read 
                            ? 'rgba(0, 0, 0, 0.6)'
                            : 'rgba(0, 0, 0, 0.4)',
                          borderRadius: 2,
                          border: '1px solid rgba(0, 229, 255, 0.3)',
                        }}
                      >
                        <ListItem
                          alignItems="flex-start"
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                          secondaryAction={
                            <Box>
                              {!announcement.read && (
                                <IconButton
                                  edge="end"
                                  aria-label="mark as read"
                                  onClick={() => handleMarkAsRead(announcement.id)}
                                  sx={{ mr: 1 }}
                                >
                                  <MarkEmailReadIcon />
                                </IconButton>
                              )}
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: getAnnouncementColor(announcement.type),
                              }}
                            >
                              {getAnnouncementIcon(announcement.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: announcement.read ? 'normal' : 'bold' }}
                              >
                                {announcement.title}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ display: 'block', my: 1 }}
                                >
                                  {announcement.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(announcement.date)}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      </Paper>
                    </Fade>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No announcements to display
                    </Typography>
                  </Box>
                )}
              </List>
            </Box>
          </Fade>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default Announcements;
