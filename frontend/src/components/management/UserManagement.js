import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL, getAuthHeader } from '../../utils/authUtils';

// Mock data for students (fallback if API fails)
const mockStudents = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    joinDate: '2024-01-15',
    status: 'Active',
    completedTests: 3,
  },
  {
    id: 2,
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    joinDate: '2024-02-01',
    status: 'Active',
    completedTests: 2,
  },
  {
    id: 3,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: '2024-02-15',
    status: 'Active',
    completedTests: 1,
  },
];

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

function UserManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Try to get students from the API
        const response = await axios.get(`${API_URL}/users/expert/invite/`, getAuthHeader());
        
        // Format the data for display
        const formattedStudents = response.data.map(user => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
          email: user.email || 'No email',
          joinDate: user.date_of_birth || new Date().toISOString().split('T')[0],
          status: 'Active',
          completedTests: Math.floor(Math.random() * 5), // Placeholder
          role: user.role || 'student'
        }));
        
        setStudents(formattedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students. Using mock data instead.');
        // Fallback to mock data
        setStudents(mockStudents);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress sx={{ color: '#00E5FF' }} />
      </Box>
    );
  }

  if (error) {
    console.warn(error);
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} md={6} lg={4} key={student.id}>
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
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 56,
                      height: 56,
                      bgcolor: '#00E5FF',
                    }}
                  >
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {student.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {student.role ? student.role.charAt(0).toUpperCase() + student.role.slice(1) : 'Student'}
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 20, color: '#00E5FF' }} />
                    <Typography variant="body2" sx={{ color: '#00E5FF' }}>
                      {student.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 20, color: '#00E5FF' }} />
                    <Typography variant="body2" sx={{ color: '#00E5FF' }}>
                      Joined {formatDate(student.joinDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon sx={{ fontSize: 20, color: '#00E5FF' }} />
                    <Typography variant="body2" sx={{ color: '#00E5FF' }}>
                      {student.completedTests} Tests Completed
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Chip 
                    label={student.status}
                    sx={{
                      color: '#00E5FF',
                      borderColor: '#00E5FF',
                      bgcolor: 'transparent',
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default UserManagement; 
