import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Collapse,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BaseLayout from '../Layout/BaseLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function DataDisplay() {
  const [showPastStats, setShowPastStats] = useState(false);

  const visitData = [
    { day: 'Friday', visits: 80 },
    { day: 'Saturday', visits: 45 },
    { day: 'Sunday', visits: 45 },
    { day: 'Monday', visits: 90 },
    { day: 'Tuesday', visits: 75 },
    { day: 'Today', visits: 60 },
  ];

  const pastMonthsData = [
    { month: 'January', visits: 1200, completion: 85 },
    { month: 'February', visits: 1500, completion: 78 },
    { month: 'March', visits: 1100, completion: 92 },
    { month: 'April', visits: 1800, completion: 88 },
  ];

  const handleTogglePastStats = () => {
    setShowPastStats(!showPastStats);
  };

  return (
    <BaseLayout role="admin">
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/Background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
      }} />
      <Box sx={{ 
        minHeight: '100vh',
        position: 'relative',
        py: 4,
        overflowY: 'auto',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <BarChartIcon sx={{ color: 'white', fontSize: 32, mr: 2 }} />
            <Typography variant="h4" sx={{ color: 'white' }}>
              Summary of the month
            </Typography>
          </Box>

          <Card sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', borderRadius: 2, mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Visits of the week
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    Last Update: a minute ago
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    endIcon={showPastStats ? <KeyboardArrowUpIcon /> : <ArrowForwardIcon />}
                    onClick={handleTogglePastStats}
                    sx={{ 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {showPastStats ? 'Show Less' : 'See All'}
                  </Button>
                </Box>
              </Box>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={visitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="white" />
                    <YAxis stroke="white" />
                    <Bar dataKey="visits" fill="#03a9f4" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Collapse in={showPastStats}>
                <Box sx={{ mt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 4 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                    Past Months Statistics
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={pastMonthsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="white" />
                        <YAxis stroke="white" />
                        <Bar dataKey="visits" fill="#1a237e" name="Total Visits" />
                        <Bar dataKey="completion" fill="#03a9f4" name="Completion Rate (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default DataDisplay; 
