import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Fade,
} from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as ExpertIcon,
  People as PeopleIcon,
  ManageAccounts as ManagementIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';
import LectureManagement from './LectureManagement';
import ExpertManagement from './ExpertManagement';
import UserManagement from './UserManagement';

function TabPanel({ children, value, index }) {
  return (
    <Fade in={value === index}>
      <div role="tabpanel" hidden={value !== index}>
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    </Fade>
  );
}

function Management() {
  const { role } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <BaseLayout role={role}>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          pt: 4,
          pb: 10,
        }}
      >
        <Container>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <ManagementIcon sx={{ fontSize: 32 }} />
            Management Dashboard
          </Typography>

          <Paper 
            sx={{ 
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              mb: 3,
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
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  textTransform: 'none',
                  fontWeight: 500,
                  py: 2,
                },
              }}
            >
              <Tab 
                icon={<SchoolIcon sx={{ mr: 1 }} />} 
                label="Lecture Management" 
                iconPosition="start"
              />
              <Tab 
                icon={<ExpertIcon sx={{ mr: 1 }} />} 
                label="Expert Management" 
                iconPosition="start"
              />
              <Tab 
                icon={<PeopleIcon sx={{ mr: 1 }} />} 
                label="User Management" 
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            <LectureManagement />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ExpertManagement />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <UserManagement />
          </TabPanel>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default Management; 
