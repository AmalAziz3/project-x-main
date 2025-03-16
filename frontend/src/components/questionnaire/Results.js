import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  School as SchoolIcon,
  DateRange as DateIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';

// Mock data - Replace with API call when backend is ready
const mockResults = [
  {
    id: 1,
    date: '2024-03-15',
    recommendedMajor: 'Computer Science',
    explanation: 'Based on your strong analytical skills and interest in technology.',
    alternativeMajors: ['Software Engineering', 'Data Science', 'Information Technology'],
    score: 85,
  },
  {
    id: 2,
    date: '2024-02-28',
    recommendedMajor: 'Business Administration',
    explanation: 'Your leadership qualities and business acumen suggest a strong fit.',
    alternativeMajors: ['Economics', 'Marketing', 'International Business'],
    score: 78,
  },
];

function Results() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Major Selection History
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Timeline position="alternate">
            {mockResults.map((result) => (
              <TimelineItem key={result.id}>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <SchoolIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" color="primary">
                          {result.recommendedMajor}
                        </Typography>
                        <Chip
                          icon={<DateIcon />}
                          label={new Date(result.date).toLocaleDateString()}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body1" paragraph>
                        {result.explanation}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Alternative Majors:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {result.alternativeMajors.map((major, index) => (
                          <Chip
                            key={index}
                            label={major}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={`Match Score: ${result.score}%`}
                          color="primary"
                          variant="outlined"
                        />
                        <Button
                          startIcon={<CompareIcon />}
                          variant="outlined"
                          size="small"
                        >
                          Compare
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body2" paragraph>
                You have taken the questionnaire {mockResults.length} times.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Top Recommended Majors:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Array.from(
                  new Set(mockResults.map((r) => r.recommendedMajor))
                ).map((major, index) => (
                  <Chip
                    key={index}
                    label={major}
                    color="primary"
                    variant="outlined"
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                href="/questionnaire"
              >
                Take New Questionnaire
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Results; 
