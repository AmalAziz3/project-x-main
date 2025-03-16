import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  Create as CreateIcon,
  Forum as ForumIcon,
  Storage as StorageIcon,
  Analytics as AnalyticsIcon,
  Dashboard as DashboardIcon,
  ManageAccounts as ManagementIcon,
  Assessment,
  History,
  ArrowForward,
  Refresh,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';
import { cardStyles } from '../layout/baseStyles';
import { styled } from '@mui/material/styles';

// Mock data for demonstration
const mockStats = {
  admin: {
    totalUsers: 150,
    totalQuestionnaires: 120,
    activeUsers: 45,
    popularMajors: [
      { name: 'Computer Science', count: 25 },
      { name: 'Engineering', count: 20 },
      { name: 'Business', count: 15 },
    ],
  },
  expert: {
    assignedStudents: 30,
    pendingReviews: 5,
    completedReviews: 25,
    recentActivities: [
      { id: 1, type: 'Review', student: 'John Doe', major: 'Computer Science', date: '2024-03-15' },
      { id: 2, type: 'Feedback', student: 'Jane Smith', major: 'Engineering', date: '2024-03-14' },
    ],
  },
  student: {
    completedQuestionnaires: 1,
    suggestedMajors: ['Computer Science', 'Software Engineering', 'Information Technology'],
    nextSteps: [
      'Complete your profile',
      'Schedule a meeting with an advisor',
      'Explore course requirements',
    ],
  },
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ color: color }} />
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

// const RecentAssessment = ({ date, score, major }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="subtitle1" fontWeight="medium">
        {major}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {date}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ flexGrow: 1, mr: 2 }}>
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}
        />
      </Box>
      <Typography variant="body2" color="primary" fontWeight="medium">
        {score}%
      </Typography>
    </Box>
  </Box>
);

function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 4 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PeopleIcon}
            title="Total Users"
            value={mockStats.admin.totalUsers}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AssessmentIcon}
            title="Total Questionnaires"
            value={mockStats.admin.totalQuestionnaires}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUpIcon}
            title="Active Users"
            value={mockStats.admin.activeUsers}
          />
        </Grid>
        <Grid item xs={12}>
          <Card sx={cardStyles.default}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Popular Majors
              </Typography>
              <List>
                {mockStats.admin.popularMajors.map((major, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <SchoolIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={major.name}
                      secondary={`${major.count} students`}
                      primaryTypographyProps={{ color: 'text.primary' }}
                      secondaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function ExpertDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 4 }}>
        Expert Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={PeopleIcon}
            title="Assigned Students"
            value={mockStats.expert.assignedStudents}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={AssignmentIcon}
            title="Pending Reviews"
            value={mockStats.expert.pendingReviews}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={AssessmentIcon}
            title="Completed Reviews"
            value={mockStats.expert.completedReviews}
            color="success"
          />
        </Grid>
        <Grid item xs={12}>
          <Card sx={cardStyles.default}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Recent Activities
              </Typography>
              <List>
                {mockStats.expert.recentActivities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${activity.type} - ${activity.student}`}
                        secondary={`Major: ${activity.major} • ${activity.date}`}
                        primaryTypographyProps={{ color: 'text.primary' }}
                        secondaryTypographyProps={{ color: 'text.secondary' }}
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function StudentDashboard() {
  // const navigate = useNavigate();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 4 }}>
        Student Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <StatCard
            icon={AssessmentIcon}
            title="Completed Questionnaires"
            value={mockStats.student.completedQuestionnaires}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={cardStyles.default}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Suggested Majors
              </Typography>
              <List>
                {mockStats.student.suggestedMajors.map((major, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <SchoolIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={major}
                      primaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={cardStyles.default}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Next Steps
              </Typography>
              <List>
                {mockStats.student.nextSteps.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={step}
                      primaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function Dashboard() {
  const { role } = useSelector((state) => state.auth);

  const DashboardContent = () => (
    <>
      {role === 'admin' && <AdminDashboard />}
      {role === 'expert' && <ExpertDashboard />}
      {role === 'student' && <StudentDashboard />}
    </>
  );

  return (
    <BaseLayout role={role}>
      <DashboardContent />
    </BaseLayout>
  );
}

export default Dashboard;
