import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

// Mock data for experts (replace with actual data later)
const mockExperts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    specialization: 'Architecture',
    lectures: [
      'Architecture Design Principles',
      'Sustainable Building Practices',
      'Urban Planning Fundamentals'
    ],
    status: 'Active',
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    email: 'michael.chen@example.com',
    specialization: 'Business Management',
    lectures: [
      'Business Management Fundamentals',
      'Strategic Leadership',
      'Corporate Finance'
    ],
    status: 'Active',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    specialization: 'Medical Sciences',
    lectures: [
      'Medical Sciences Overview',
      'Healthcare Systems',
      'Clinical Practice Basics'
    ],
    status: 'Active',
  },
];

function ExpertManagement() {
  const [experts, setExperts] = useState(mockExperts);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const handleDeleteClick = (expert) => {
    setSelectedExpert(expert);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setExperts(experts.filter((expert) => expert.id !== selectedExpert.id));
    setDeleteDialogOpen(false);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {experts.map((expert) => (
          <Grid item xs={12} md={6} key={expert.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56,
                        bgcolor: '#00E5FF',
                      }}
                    >
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                        {expert.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {expert.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="Delete Expert">
                    <IconButton
                      onClick={() => handleDeleteClick(expert)}
                      sx={{
                        color: '#ff4444',
                        '&:hover': {
                          bgcolor: 'rgba(255, 68, 68, 0.1)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={expert.specialization}
                    sx={{ 
                      mr: 1, 
                      mb: 1,
                      color: '#00E5FF',
                      borderColor: '#00E5FF',
                      '& .MuiChip-icon': {
                        color: '#00E5FF',
                      },
                    }}
                    icon={<SchoolIcon />}
                    variant="outlined"
                  />
                  <Chip 
                    label={expert.status}
                    sx={{ 
                      mb: 1,
                      color: '#00E5FF',
                      borderColor: '#00E5FF',
                    }}
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#00E5FF', mb: 1 }}>
                    Lectures Given:
                  </Typography>
                  {expert.lectures.map((lecture, index) => (
                    <Typography 
                      key={index} 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 0.5,
                        pl: 2,
                        borderLeft: '2px solid #00E5FF',
                      }}
                    >
                      {lecture}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Expert</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedExpert?.name}? This action cannot be undone.
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

export default ExpertManagement; 
