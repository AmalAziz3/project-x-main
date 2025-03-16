import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BaseLayout from '../Layout/BaseLayout';

function CircularProgressWithLabel({ value, color, size = 120, thickness = 5, label, sublabel }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={value}
          size={size}
          thickness={thickness}
          sx={{
            color: color || '#2196f3',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" component="div" color="text.primary">
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ mt: 2, color: 'text.secondary', textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
        {label}
      </Typography>
      {sublabel && (
        <Typography sx={{ mt: 1, color: 'text.secondary', textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
          {sublabel}
        </Typography>
      )}
    </Box>
  );
}

function TestAnalysis() {
  const stats = [
    { value: 90, label: 'End The Test', color: '#1a237e' },
    { 
      value: 70, 
      label: '', 
      sublabel: 'Gender: 40% girls, 30% boys',
      color: '#03a9f4' 
    },
  ];

  return (
    <BaseLayout role="admin">
      <Box sx={{ 
        minHeight: '100vh',
        width: '100%',
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/Background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        py: 4,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <AssessmentIcon sx={{ color: 'white', fontSize: 32, mr: 2 }} />
            <Typography variant="h4" sx={{ color: 'white' }}>
              Test Analysis
            </Typography>
          </Box>
          <Card sx={{ mb: 4, bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
            <CardContent>
              <Grid container spacing={4} justifyContent="center" alignItems="center">
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} key={index} sx={{ textAlign: 'center' }}>
                    <CircularProgressWithLabel 
                      value={stat.value} 
                      color={stat.color}
                      label={stat.label}
                      sublabel={stat.sublabel}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default TestAnalysis; 
